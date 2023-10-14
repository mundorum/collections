import { html, css, Oid, OidUI } from '/src/lib/oidlib-dev.js'
import * as Blockly from 'blockly'
import {javascriptGenerator} from 'blockly/javascript'

export class BlocklyOid extends OidUI {
  async connectedCallback () {
    await super.connectedCallback()
    const blocks = this._getCustomField('blocks')
    if (blocks != null) {
      Blockly.common.defineBlocks(
        Blockly.common.createBlockDefinitionsFromJsonArray(
          blocks))
      const generator = this._getCustomField('generator')
      if (generator != null)
        Object.assign(javascriptGenerator.forBlock, generator)
    }
    this.render()
  }

  render () {
    super.render()
    const toolbox = this._getCustomField('toolbox')
    if (toolbox != null) {
      this._ws = Blockly.inject(this._presentation, {toolbox})
      this._ws.addChangeListener(this._blocksUpdated.bind(this))
    }
  }

  _blocksUpdated () {
    this._notify('update',
      {value: javascriptGenerator.workspaceToCode(this._ws)})
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