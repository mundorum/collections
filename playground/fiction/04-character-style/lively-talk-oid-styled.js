import { css, Oid } from '@mundorum/oid/oid.js'
import { LivelyTalkOid } from '@mundorum/collections/fiction.js'

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