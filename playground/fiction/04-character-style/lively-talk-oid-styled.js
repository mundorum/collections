import { css, Oid } from '/lib/foundation/oidlib-dev.js'
import { LivelyTalkOid } from '/lib/fiction/oid-fiction-dev.js'

export { LivelyTalkOid }

Oid.customize('foid:lively-talk', {
  cid: 'big',
  style: css`
  .character {
    width: 256px;
  }
  .bubble {
    height: 700px;
    padding-left: 100px;
    padding-top: 100px;
  }`
})