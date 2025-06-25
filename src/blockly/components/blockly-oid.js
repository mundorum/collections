import { html, Oid, OidUI } from '@mundorum/oid/oid.js'
import * as Blockly from 'blockly'
export const jsonGenerator = new Blockly.Generator('JSON')

export class BlocklyOid extends OidUI {
  async connectedCallback () {
    this._lastUpdate = ''
    await super.connectedCallback()
    const blocks = this._getCustomField('blocks')
    if (blocks != null) {
      Blockly.common.defineBlocks(
        Blockly.common.createBlockDefinitionsFromJsonArray(
          blocks))
      const generator = this._getCustomField('generator')
      if (generator != null)
        Object.assign(jsonGenerator.forBlock, generator)
      this._load = this._getCustomField('load')
    }
    this.render()
  }

  render () {
    super.render()
    const toolbox = this._getCustomField('toolbox')
    if (toolbox != null) {
      this._ws = Blockly.inject(this._presentation, {toolbox})
      this._ws.addChangeListener(this._blocksUpdated.bind(this))
      if (this._load != null) {
        Blockly.serialization.workspaces.load(this._load, this._ws)
        this._load = null
      }
    }
  }

  _blocksUpdated () {
    const json = jsonGenerator.workspaceToCode(this._ws)
    if (json !== this._lastUpdate) {
      this._lastUpdate = json
      this._notify('update', {value: json})
    }
  }

  handleResize () {
    Blockly.svgResize(this._ws)
  }
}

Oid.component({
  id: 'boid:blockly',
  element: 'blockly-oid',
  receive: ['resize'],
  implementation: BlocklyOid,
  shadow: false,
  template: html`
  <div id="oid-prs" style="width:100%;height:100vh">
  </div>`
})