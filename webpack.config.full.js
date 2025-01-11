const path = require('path')

module.exports = {
  entry: [
    './src/collections/fiction/assembly.js',
    './src/collections/blockly/assembly.js',
    './src/collections/graph/assembly-layer.js',
    './src/collections/assembly.js'
  ],
  output: {
    filename: 'oid-full.js',
    path: path.resolve(__dirname, 'pack'),
    globalObject: 'self',
    library: {
      name: 'oidfull',
      type: 'umd'
    }
  },
  mode: 'production'
}