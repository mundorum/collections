import { css, Oid } from '/lib/foundation/oidlib-dev.js'

import { LivelyTalkOid } from '/lib/fiction/oid-fiction-dev.js'

export { LivelyTalkOid }

Oid.customize('foid:lively-talk', {
  cid: 'robot',
  style: css`
  .character {
    width: 256px;
  }
  .bubble {
    height: 40vh;
    padding-left: 100px;
  }`
})