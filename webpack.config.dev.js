const path = require('path')

module.exports = {
  entry: './src/collections/fiction/assembly.js',
  experiments: {
    outputModule: true,
  },
  output: {
    filename: 'oid-fiction-dev.js',
    path: path.resolve(__dirname, 'pack'),
    library: {
      type: 'module'
    }
  },
  mode: 'development'
}