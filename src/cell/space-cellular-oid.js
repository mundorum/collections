/**
 * Cellular Space for Oids
 */

import { html, css, Oid, OidUI } from '/src/lib/oidlib-dev.js'

class SpaceCellularOid extends OidUI {
  constructor () {
    super()
    this.cellTypeRegister = this.cellTypeRegister.bind(this)
    this.ruleRegister = this.ruleRegister.bind(this)
    this.toolRegister = this.toolRegister.bind(this)

    this._cellTypes = {}
    this._rules = {}
    this._wildcardRules = []
    this._stateTypes = null  // state types in the grid
    this._tools = []
  }

  connectedCallback () {
    super.connectedCallback()

    this._stateStr = this.innerHTML.trim()

    this._stateTypes = []
    for (const c of this._stateStr) {
      if (![' ', '_', '\r', '\n'].includes(c) &&
          !this._stateTypes.includes(c)) {
        this._stateTypes.push(c)
      }
    }

    this._buildInnerHTML()

    if (!this._state && this._checkAllTypes()) { this._createIndividuals() }

    this._subscribe('oid/cell-type/register', this.cellTypeRegister)
    this._subscribe('oid/rule-cell/register', this.ruleRegister)
    this._subscribe('oid/tool-cell/register', this.toolRegister)
  }

  _buildInnerHTML () {
    this._stateLines = []  // initial state matrix in character format

    if (this._stateStr.length > 0) {
      this._stateLines = this._stateStr.split(/[\r\n]+/gm)
      for (const s in this._stateLines) {
        this._stateLines[s] = this._stateLines[s].trim()
      }
    }

    if (!this.rows) {
      this.rows = (this._stateLines.length > 0) ? this._stateLines.length : 10
    }
    if (!this.cols) {
      if (this._stateLines.length > 0) {
        let maior = this._stateLines[0].length
        for (const s in this._stateLines) {
          maior = (this._stateLines[s].length > maior)
            ? this._stateLines[s].length : maior
        }
        this.cols = maior
      } else { this.cols = 10 }
    }

    if (!this.backgroundColor) {
      this.backgroundColor = (!this.backgroundImage) ? '#ffffc8' : '#ffffff00'
    }

    const width = this.cols * this.cellWidth + 'px'
    const height = this.rows * this.cellHeight + 'px'
    this.innerHTML = SpaceCellularOid.svgTemplate
      .replace(/{cell-width}/g, this.cellWidth + 'px')
      .replace(/{cell-height}/g, this.cellHeight + 'px')
      .replace(/{width-div}/g, this.cols * this.cellWidth + 12 + 'px')
      .replace(/{height-div}/g, this.rows * this.cellHeight + 12 + 'px')
      .replace(/{width}/g, width)
      .replace(/{height}/g, height)
      .replace(/{background-color}/g, this.backgroundColor)
      .replace(/{background-image}/g,
        (this.backgroundImage == null) ? ''
          : "<image href='" + this.backgroundImage + "' width='" + width +
                                 "' height='" + height + "'/>")
      .replace(/{grid}/g, (this.grid && this.cellWidth >= 5)
        ? " stroke-width='2' stroke='#646464'" : '')
      .replace(/{cover-image}/g,
        (this.coverImage == null) ? ''
          : "<image id='cover-image' href='" + this.coverImage +
             "' width='" + width + "' height='" + height + "'" +
             ((this.coverOpacity) ? " opacity='" + this.coverOpacity + "'" : '')
             + '/>')
    this._cellGrid = this.querySelector('#cell-grid')
    this._cells = this.querySelector('#cells')
    this._svgSpace = this.querySelector('#svg-space')
    this._gridRect = this.querySelector('#grid-rect')
    this._scaleSpace()
  }

  _scaleSpace () {
    if (this.hasAttribute('scale')) {
      if (this.grid) {
        if (this.cellWidth * this.scale < 5) {
          if (this._gridRect.hasAttribute('stroke-width')) {
            this._gridRect.removeAttribute('stroke-width')
            this._gridRect.removeAttribute('stroke')
          }
        } else {
          this._gridRect.setAttribute('stroke-width', 2 / this.scale)
          this._gridRect.setAttribute('stroke', '#646464')
        }
      }

      this._cellGrid.setAttribute('transform',
        'scale(' + this.scale + ' ' + this.scale + ')')
      this._svgSpace.setAttribute('width',
        this.cols * this.cellWidth * this.scale + 'px')
      this._svgSpace.setAttribute('height',
        this.rows * this.cellHeight * this.scale + 'px')
      this._svgSpace.scrollIntoView({ block: 'end' })
    }
  }

  disconnectedCallback () {
    this._unsubscribe('oid/cell-type/register', this.cellTypeRegister)
    this._unsubscribe('oid/rule-cell/register', this.ruleRegister)
    this._unsubscribe('oid/tool-cell/register', this.toolRegister)
  }

  cellTypeRegister (topic, cellType) {
    cellType.space = this
    this._cellTypes[cellType.type] = cellType
    if (!this._rules[cellType.type])
      this._rules[cellType.type] = this._wildcardRules.slice()
    if (!this._state && this._checkAllTypes()) this._createIndividuals()
  }

  _checkAllTypes () {
    let all = (this._stateTypes != null)
    for (const s in this._stateTypes) {
      if (!this._cellTypes[this._stateTypes[s]]) { all = false }
    }
    return all
  }

  _createIndividuals () {
    this._state = this._createEmptyState()
    if (this._stateLines.length > 0) {
      for (const r in this._stateLines) {
        for (let c = 0; c < this._stateLines[r].length; c++) {
          if (this._cellTypes[this._stateLines[r][c]]) {
            this._state[r][c] =
                     this._cellTypes[this._stateLines[r][c]]
                       .createIndividualInitial(parseInt(r) + 1, c + 1, null)
            this._cells.appendChild(this._state[r][c].element)
          }
        }
      }
      this.analysisPublish()
    }
  }

  _createEmptyState () {
    const state = []
    for (let r = 0; r < this.rows; r++) {
      const row = []
      for (let c = 0; c < this.cols; c++) { row.push(null) }
      state.push(row)
    }
    return state
  }

  _changeControl () {
    const control = []
    for (let row = 0; row < this._state.length; row++) {
      control[row] = []
      for (let col = 0; col < this._state[row].length; col++)
        control[row][col] = false
    }
    return control
  }

  ruleRegister (topic, rule) {
    if (rule.transition[0] == '?' || rule.transition[0] == '!') {
      this._addNewRule(this._wildcardRules, rule)
      for (const r in this._cellTypes) {
        if (!this._rules[r]) { this._rules[r] = this._wildcardRules.slice() }
        this._addNewRule(this._rules[r], rule)
      }
    } else {
      if (!this._rules[rule.transition[0]]) {
        this._rules[rule.transition[0]] = this._wildcardRules.slice()
      }
      this._addNewRule(this._rules[rule.transition[0]], rule)
    }
  }

  _addNewRule(ruleSet, rule) {
    if (this.policy == 'crescent' && rule.probability) {
      let r = 0;
      while (r < ruleSet.length &&
             (!ruleSet[r].probability || rule.probility >= ruleSet[r].probability))
        r++;
      ruleSet.splice(r, 0, rule)
    } else
      ruleSet.push(rule)
  }

  toolRegister (topic, tool) {
    tool.space = this
    this._tools.push(tool)
  }

  toolActive () {
  }

  toolInactive () {
  }

  computeCoordinates (row, col) {
    return {
      x: (col - 1) * this.cellWidth,
      y: (row - 1) * this.cellHeight,
      width: this.cellWidth,
      height: this.cellHeight
    }
  }

  computeCellCenter (row, col) {
    return {
      x: Math.round((col - 0.5) * this.cellWidth),
      y: Math.round((row - 0.5) * this.cellHeight)
    }
  }

  static computeDefaultCoordinates (row, col) {
    return {
      x: col * SpaceCellularOid.defaultCellDim.width,
      y: row * SpaceCellularOid.defaultCellDim.height,
      width: SpaceCellularOid.defaultCellDim.width,
      height: SpaceCellularOid.defaultCellDim.height
    }
  }

  mapCoordinatesToSpace (x, y) {
    const gc = this._cellGrid.getBoundingClientRect()
    const scale = (this.scale) ? this.scale : 1
    return {
      x: Math.trunc((x - gc.x) / scale),
      y: Math.trunc((y - gc.y) / scale)
    }
  }

  computeCell (x, y) {
    return {
      row: Math.floor(y / this.cellHeight) + 1,
      col: Math.floor(x / this.cellWidth) + 1
    }
  }

  notify (topic, message) {
    switch (topic.toLowerCase()) {
      case 'next': this.stateNext(); break
      case 'cover-opacity':
        this.coverOpacity = parseInt(message.value) / 100
        this.querySelector('#cover-image').setAttribute('opacity', this.coverOpacity)
        break
      case 'scale':
        this.scale = parseInt(message.value)
        this._scaleSpace()
        break
    }
  }

  stateNext () {
    const spaceState = {
      state: this._state,  // state of each cell in the grid
      nrows: this._state.length,
      infinite: this.infinite,
      cells: this._cells,  // reference to the SVG cell space
      cellTypes: this._cellTypes,
      vtypes: Object.keys(this._cellTypes),
      changed: this._changeControl()
    }
    for (let r = 0; r < spaceState.nrows; r++) {
      const row = this._state[r]
      spaceState.ncols = row.length
      for (let c = 0; c < spaceState.ncols; c++) {
        const cell = row[c]
        if (cell != null && !spaceState.changed[r][c] &&
            this._rules[cell.dcc.type]) {
          let triggered = false
          for (let m = 0; m < this._rules[cell.dcc.type].length &&
               !triggered; m++) {
            triggered = this._rules[cell.dcc.type][m]
              .computeRule(spaceState, r, c)
          }
        }
      }
    }
    this.analysisPublish()
  }

  analysisPublish () {
    if (this.hasAttribute('analysis')) {
      const analysis = {}
      for (const row of this._state)
        for (const cell of row) {
          if (cell != null) {
            if (analysis[cell.dcc.label] == null)
              analysis[cell.dcc.label] = 1
            else
              analysis[cell.dcc.label]++
          }
        }
      this._publish('oid/analysis/data', analysis)
    }
  }
}

class SpaceCellularEditorOid extends SpaceCellularOid {
  constructor () {
    super()
    this._editType = '_'
    this.cellClicked = this.cellClicked.bind(this)
    this.rulesClear = this.rulesClear.bind(this)
    this.requestState = this.requestState.bind(this)
    this.updateState = this.updateState.bind(this)
    this._subscribe('oid/rules/clear', this.rulesClear)
    this._subscribe('space-cellular-oid/request/state', this.requestState)
    this._subscribe('space-cellular-oid/update/state', this.updateState)
  }

  connectedCallback () {
    super.connectedCallback()
    this.activateEditor()
  }

  activateEditor () {
    this._activeEditor = true
    this._cellGrid.addEventListener('click', this.cellClicked, false)
  }

  deactivateEditor () {
    this._activeEditor = false
    this._cellGrid.removeEventListener('click', this.cellClicked)
  }

  toolActive () {
    this._editorWasActive = this._activeEditor
    if (this._activeEditor) { this.deactivateEditor() }
  }

  toolInactive () {
    if (this._editorWasActive) { this.activateEditor() }
  }

  cellClicked (event) {
    const mapped = this.mapCoordinatesToSpace(event.clientX, event.clientY)
    const cell = this.computeCell(mapped.x, mapped.y)
    this.changeState(this._editType, cell.row, cell.col)
  }

  changeState (type, row, col) {
    const r = row - 1
    const c = col - 1
    if (this._state[r][c] != null && this._state[r][c].dcc.type != type) {
      this._cells.removeChild(this._state[r][c].element)
      this._state[r][c] = null
    }
    if ((this._state[r][c] == null || this._state[r][c].dcc.type != type) &&
          this._cellTypes[type]) {
      this._state[r][c] =
            this._cellTypes[type].createIndividualInitial(row, col,
              (this._editProps) ? this._editProps : null)
      this._cells.appendChild(this._state[r][c].element)
    }
  }

  serializeState () {
    let str = ''
    for (const r in this._state) {
      for (const c in this._state[r]) { str += (this._state[r][c] == null) ? '_' : this._state[r][c].dcc.type }
      str += '\n'
    }
    return str
  }

  // <TODO> provisory
  resetState () {
    this._buildInnerHTML()
    this._createIndividuals()
    this.activateEditor()
  }

  // <TODO> provisory
  saveState () {
    this._stateStr = this.serializeState()
    localStorage.setItem(SpaceCellularOid.storeId, this._stateStr)
  }

  // <TODO> provisory
  loadState () {
    this._stateStr = localStorage.getItem(SpaceCellularOid.storeId)
    this.resetState()
  }

  rulesClear (topic, message) {
    this._rules = {}
    this._wildcardRules = []
    this._publish(MessageBus.buildResponseTopic(topic, message), true)
  }

  // <TODO> provisory
  downloadState () {
    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)
    a.href = window.URL.createObjectURL(
      new Blob([this.serializeState()], { type: 'text/plain' })
    )
    a.setAttribute('download', 'cenario.txt')

    a.click()

    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  }

  requestState (topic, message) {
    this._publishHasResponse (topic, message, this.serializeState(), false)
  }

  updateState (topic, message) {
    this._stateStr = message
    this.resetState()
  }

  notify (topic, message) {
    super.notify(topic, message)
    if (topic.startsWith('type/')) {
      const tLabel = MessageBus.extractLevel(topic, 2)
      if (tLabel.toLowerCase() == 'empty') { this._editType = '_' } else {
        for (const t in this._cellTypes) {
          if (this._cellTypes[t].label.toLowerCase() == tLabel.toLowerCase()) { this._editType = t }
        }
      }
      if (message.value) {
        this._editProps = this.extractProperties(message.value)
      } else { this._editProps = null }
      for (const t of this._tools) { t.inactivateTool() }
    } else
      switch (topic.toLowerCase()) {
        case 'reset': this.resetState(); break
        case 'edit': this.activateEditor(); break
        case 'view': this.deactivateEditor(); break
        case 'save': this.saveState(); break
        case 'load': this.loadState(); break
        case 'download': this.downloadState(); break
      }
  }

  extractProperties (propsStr) {
    const props = {}
    const propsv = propsStr.split(';')
    for (const p of propsv) {
      if (p.includes(':')) {
        const pv = p.split(':')
        props[pv[0].trim()] = pv[1].trim()
      } else { props[p.trim()] = '' }
    }
    return props
  }
}

/*
 * Policy to evaluate the rules for the same type
 * * sequence - in the insertion sequence
 * * crescent - in crescent order of probability
 */

Oid.component({
  id: 'coid:space-cellular',
  element: 'space-cellular-oid',
  properties: {
    label: {},
    cols: {},
    rows: {},
    'cell-width': {default: SpaceCellularOid.defaultCellDim.width},
    'cell-height': {default: SpaceCellularOid.defaultCellDim.height},
    scale: {},
    'background-color': {},
    'background-image': {},
    'cover-image': {},
    'cover-opacity': {},
    grid: {},
    infinite: {},
    policy: {default: 'sequence'},
    analysis: {}, // activates data publication for analysis
    'cell-grid': {
      readonly: true,
      attribute: false
    },
    'cells': {
      readonly: true,
      attribute: false
    }
  },
  receive: ['cell-type', 'rule-cell', 'tool-cell'],
  // receive: {'display': 'handleSend', 'clear': 'handleClear'},
  // provide: ['itf:transfer'],
  implementation: SpaceCellularOid,
  template: html
  `<div id="grid-wrapper" style="overflow:scroll;width:{width-div};height:{height-div}">
  <svg id="svg-space" width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="{cell-width}" height="{cell-height}" patternUnits="userSpaceOnUse">
      <rect id="grid-rect" width="{cell-width}" height="{cell-height}"
       fill="{background-color}"{grid}/>
    </pattern>
  </defs>
  <g id="cell-grid">
     {background-image}
     <rect fill="url(#grid)" x="0" y="0" width="{width}" height="{height}"/>
     <g id="cells"/>
     {cover-image}
  </g>
  </svg>
  </div>`
})

Oid.component({
  id: 'coid:space-cellular-editor',
  element: 'space-cellular-oid-editor',
  implementation: SpaceCellularEditorOid,
})

SpaceCellularOid.defaultCellDim = { width: 20, height: 20 }

SpaceCellularOid.storeId = 'harena-dcc-cell-space-state'
