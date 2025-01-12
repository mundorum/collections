(function(t,e){typeof exports=="object"&&typeof module<"u"?e(exports,require("/lib/foundation/oidlib-dev.js")):typeof define=="function"&&define.amd?define(["exports","/lib/foundation/oidlib-dev.js"],e):(t=typeof globalThis<"u"?globalThis:t||self,e(t["oid-fiction"]={},t.oidlib))})(this,function(t,e){"use strict";class s extends e.OidUI{async connectedCallback(){await super.connectedCallback(),this.handleSend()}handleProcess(n,l){this._callCustom("process",l)}handleSend(n,l){let i=this.speech||"";l?i.includes("{{")?i=i.replace(/{{[ \t]*([^}]*)}}/g,(r,a)=>(a=a?a.trim():"value",l[a]?l[a]:"")):l.value&&(i+=l.value.replace(/\n/g,"<br>")):i=i.replace(/{{[ \t]*[^}]*}}/g,""),this._presentation.querySelector("#speech").innerHTML=i,this._notify("update",{value:i})}handleClear(){this._presentation.querySelector("#speech").innerHTML=""}}e.Oid.component({id:"foid:lively-talk",element:"lively-talk-oid",properties:{character:{default:"assets:images/dino.svg"},bubble:{default:"assets:images/bubble-landscape.svg"},speech:{}},receive:{process:"handleProcess",display:"handleSend",clear:"handleClear"},provide:["itf:transfer"],implementation:s,styles:e.css`
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
  }`,template:e.html`
  <div id="oid-prs" style="width:100%;display:flex;flex-direction:row">
    <img src="{{url:this.character}}" class="character">
    <div class="bubble"><div class="speech" id="speech"></div></div>
  </div>`}),t.LivelyTalkOid=s,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})});
