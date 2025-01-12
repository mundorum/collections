import { html, css, Oid, OidUI } from '/lib/foundation/oidlib-dev.js'

export class LivelyTalkOid extends OidUI {
  async connectedCallback () {
    await super.connectedCallback()
    this.handleSend()
  }

  handleProcess (topic, message) {
    this._callCustom('process', message)
  }

  handleSend (topic, message) {
    let fspeech = this.speech || ''
    if (message) {
      if (fspeech.includes('{{')) {
        fspeech = fspeech.replace(
          /{{[ \t]*([^}]*)}}/g,
          (match, p1) => {
            p1 = (p1) ? p1.trim() : 'value'
            let value = (message[p1]) ? message[p1] : ''
            return value
          })
      } else if (message.value)
        fspeech += message.value.replace(/\n/g, '<br>')
    } else
      fspeech = fspeech.replace(/{{[ \t]*[^}]*}}/g, '')
    this._presentation.querySelector('#speech').innerHTML = fspeech
    this._notify('update', {value: fspeech})
  }

  handleClear () {
    this._presentation.querySelector('#speech').innerHTML = ''
  }
}

Oid.component({
  id: 'foid:lively-talk',
  element: 'lively-talk-oid',
  properties: {
    character: {default: 'assets:images/dino.svg'},
    bubble: {default: 'assets:images/bubble-landscape.svg'},
    speech: {}
  },
  receive: {
    'process': 'handleProcess',
    'display': 'handleSend',
    'clear': 'handleClear'
  },
  provide: ['itf:transfer'],
  implementation: LivelyTalkOid,
  styles: css`
  .character {
    width: 128px;
  }
  .bubble {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    flex-basis: 100%;
    padding: 15px 15px 10px 40px;
    background-image: url("{{url:this.bubble}}");
  }
  .speech {
    font-size: 2.5vh;
    inline-size: 100%;
    overflow-wrap: break-word;
  }`,
  template: html`
  <div id="oid-prs" style="width:100%;display:flex;flex-direction:row">
    <img src="{{url:this.character}}" class="character">
    <div class="bubble"><div class="speech" id="speech"></div></div>
  </div>`
})