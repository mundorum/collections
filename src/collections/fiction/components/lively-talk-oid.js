import { html, css, Oid, OidUI } from '/src/lib/oidlib-dev.js'

export class LivelyTalkOid extends OidUI {
  connectedCallback () {
    super.connectedCallback()
    this.handleSend()
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
        fspeech += message.value
    } else
      fspeech = fspeech.replace(/{{[ \t]*[^}]*}}/g, '')
    this._presentation.querySelector('#speech').innerHTML = fspeech
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
  receive: {'display': 'handleSend', 'clear': 'handleClear'},
  provide: ['itf:transfer'],
  implementation: LivelyTalkOid,
  styles: css`
  .bubble {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    flex-basis: 100%;
    padding: 15px 15px 10px 40px;
    background-image: url("{{url:this.bubble}}");
  }`,
  template: html`
  <div id="oid-prs" style="width:100%;display:flex;flex-direction:row">
    <img src="{{url:this.character}}" width="128px">
    <div class="bubble"><div id="speech"></div></div>
  </div>`
})