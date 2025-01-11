const path = require('path')

module.exports = {
  entry: [
    './src/collections/fiction/assembly.js',
    './src/collections/blockly/assembly.js',
    './src/collections/graph/assembly-layer.js',
    './src/collections/assembly.js'
  ],
  experiments: {
    outputModule: true,
  },
  output: {
    filename: 'oid-full-dev.js',
    path: path.resolve(__dirname, 'pack'),
    library: {
      type: 'module'
    }
  },
  mode: 'development'
}