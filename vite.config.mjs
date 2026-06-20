import { defineConfig } from 'vite'
import { resolve } from 'node:path'

const oidSrc = resolve(__dirname, '../oid/src')
const oidDist = resolve(__dirname, '../oid/dist')

// shared alias: resolve @mundorum/oid imports from oid source (no npm install needed)
const oidAlias = {
  '@mundorum/oid/oid.js':  resolve(oidSrc, 'assembly.js'),
  '@mundorum/oid/oid.css': resolve(oidSrc, 'style/oid.css'),
}

function htmlAliasPlugin() {
  return {
    name: 'html-alias',
    transformIndexHtml(html) {
      // oid CDN → local oid dist via /@fs/ (requires server.fs.allow)
      const stage1 = html.replace(
        /https:\/\/cdn\.jsdelivr\.net\/npm\/@mundorum\/oid\/([^"'\s]*)/g,
        `/@fs${oidDist}/$1`
      )
      // bare @mundorum/oid CDN shortcut (no trailing slash)
      const stage2 = stage1.replace(
        /https:\/\/cdn\.jsdelivr\.net\/npm\/@mundorum\/oid(?!\/)/g,
        `/@fs${oidDist}/oid.min.js`
      )
      // collections serves itself from /dist
      const stage3 = stage2.replace(
        /https:\/\/cdn\.jsdelivr\.net\/npm\/@mundorum\/collections\/([^"'\s]*)/g,
        '/dist/$1'
      )
      // remaining CDN paths → local node_modules
      return stage3.replace(/https:\/\/cdn\.jsdelivr\.net\/npm\//g, '/node_modules/')
    }
  }
}

// Create different configs based on command (build vs serve)
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      plugins: [htmlAliasPlugin()],
      resolve: {
        preserveSymlinks: true,
        alias: {
          ...oidAlias,
          // self-references: resolve collections imports from own source
          '@mundorum/collections/full.js':    resolve(__dirname, 'src/full/assembly.js'),
          '@mundorum/collections/fiction.js': resolve(__dirname, 'src/fiction/assembly.js'),
          '@mundorum/collections/graph.js':   resolve(__dirname, 'src/graph/assembly.js'),
          '@mundorum/collections/blockly.js': resolve(__dirname, 'src/blockly/assembly.js'),
        }
      },
      server: {
        fs: {
          allow: [__dirname, resolve(__dirname, '../../oid')]
        }
      }
    }
  }

  const [collection, target] = mode.split('_')

  const assetFileNames = (assetInfo) => {
    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
      return target === 'development' ? `${collection}.css` : `${collection}.min.css`
    }
    return assetInfo.name
  }

  const rollupOptions = (collection === 'full') ? {
    output: { assetFileNames }
  } : {
    external: (id) => id.startsWith('@mundorum/oid'),
    output: {
      globals: {
        '@mundorum/oid/oid.js': 'oidlib'
      },
      assetFileNames
    }
  }

  if (target === 'development') {
    return {
      resolve: { preserveSymlinks: true, alias: oidAlias },
      build: {
        lib: {
          entry: resolve(__dirname, `src/${collection}/assembly.js`),
          name: `${collection}`,
          fileName: () => `${collection}.js`, // function avoids .es
          formats: ['es']  // ES module format
        },
        minify: false,
        sourcemap: true,
        outDir: 'dist',
        emptyOutDir: false, // avoid cleaning the output directory
        rollupOptions: rollupOptions
      }
    }
  }
  // Production config (UMD build)
  return {
    resolve: { preserveSymlinks: true, alias: oidAlias },
    build: {
      lib: {
        entry: resolve(__dirname, `src/${collection}/assembly.js`),
        name: `${collection}`,
        fileName: () => `${collection}.min.js`, // function avoids .umd
        formats: ['umd']
      },
      minify: true,
      outDir: `dist`,
      emptyOutDir: false,
      cssMinify: true,
      rollupOptions: rollupOptions
    }
  }
})
