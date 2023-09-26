const path = require('path')

module.exports = {
  entry: './src/collections/fiction/assembly.js',
  output: {
    filename: 'oid-fiction.js',
    path: path.resolve(__dirname, 'pack'),
    globalObject: 'self',
    library: {
      name: 'oidcoll',
      type: 'umd'
    }
  },
  mode: 'production'
}