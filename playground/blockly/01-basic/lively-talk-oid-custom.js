import { css, Oid } from '@mundorum/oid/oid.js'

import { LivelyTalkOid } from '@mundorum/collections/fiction.js'

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