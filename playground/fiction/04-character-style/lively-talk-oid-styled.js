import { css, Oid } from '/pack/oid-fiction-dev.js'

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