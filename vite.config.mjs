import { defineConfig } from 'vite'
import { resolve } from 'node:path'

function htmlAliasPlugin() {
  return {
    name: 'html-alias',
    transformIndexHtml(html) {
      // replace automatically redirected CDN link
      const stage1 = html.replace(
        /https:\/\/cdn\.jsdelivr\.net\/npm\/@mundorum\/oid(?!\/)/g,
        '/node_modules/@mundorum/oid/oid.min.js'
      )
      // replace remaining CDN paths with local paths
      return stage1.replace(/https:\/\/cdn.jsdelivr.net\/npm\//g, '/node_modules/')
    }
  }
}

// Create different configs based on command (build vs serve)
export default defineConfig(({ command, mode }) => {
  // If running dev server (serve command), use the server configuration
  if (command === 'serve') {
    return {
      plugins: [htmlAliasPlugin()]
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
    external: (id) => id === '@mundorum/oid/oid.js',
    output: {
      globals: {
        '@mundorum/oid/oid.js': 'oidlib'
      },
      assetFileNames
    }
  }

  if (target === 'development') {
    return {
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
