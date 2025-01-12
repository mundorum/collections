import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// Create different configs based on command (build vs serve)
export default defineConfig(({ command, mode }) => {
  const [collection, target] = mode.split('_')
  const rollupOptions = (collection === 'full') ? {} :
    {
      external: (id) => id.includes('oidlib-dev.js'),
      output: {
        globals: {
          '/lib/foundation/oidlib-dev.js': 'oidlib'
        }
      }
    }
  if (target === 'development') {
    return {
      build: {
        lib: {
          entry: resolve(__dirname, `src/${collection}/assembly.js`),
          name: `oid-${collection}`,
          fileName: () => `oid-${collection}-dev.js`, // function avoids .es
          formats: ['es']  // ES module format
        },
        minify: false,
        sourcemap: true,
        outDir: `lib/${collection}`,
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
        name: `oid-${collection}`,
        fileName: () => `oid-${collection}.js`, // function avoids .umd
        formats: ['umd']
      },
      minify: true,
      outDir: `lib/${collection}`,
      emptyOutDir: false,
      rollupOptions: rollupOptions
    }
  }
})
