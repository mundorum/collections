import { Oid } from '/pack/oid-full-dev.js'

Oid.customize('boid:blockly', {

cid: 'kolb1',

toolbox: {
  'kind': 'categoryToolbox',
  'contents': []
},

blocks:
[
  {
    'type': 'op1',
    'message0': 'Gosto de lidar com meus sentimentos',
    'colour': 200,
    'output': 'op'
  },
  {
    'type': 'op2',
    'message0': 'Gosto de pensar sobre idéias',
    'colour': 200,
    'output': 'op'
  },
  {
    'type': 'op3',
    'message0': 'Gosto de observar e escutar',
    'colour': 200,
    'output': 'op'
  },
  {
    'type': 'op4',
    'message0': 'Gosto de estar fazendo coisas',
    'colour': 200,
    'output': 'op'
  },
  {
    'type': 'question',
    'message0': 'Enquanto aprendo:\n',
    'args0': [],
    'message1': '4 %1 \n',
    'args1': [
      {
        'type': 'input_value',
        'name': 'q1',
        'check': 'op'
      }
    ],
    'message2': '3 %1 \n',
    'args2': [
      {
        'type': 'input_value',
        'name': 'q2',
        'check': 'op'
      }
    ],
    'message3': '2 %1 \n',
    'args3': [
      {
        'type': 'input_value',
        'name': 'q3',
        'check': 'op'
      }
    ],
    'message4': '1 %1 \n',
    'args4': [
      {
        'type': 'input_value',
        'name': 'q4',
        'check': 'op'
      }
    ],
    'colour': 220
  }
],

generator: {
  'op1': function (block, generator) {
    return `op1`
  },
  'op2': function (block, generator) {
    return `op2`
  },
  'op3': function (block, generator) {
    return `op3`
  },
  'op4': function (block, generator) {
    return `op4`
  },
  'question': function (block, generator) {
    return JSON.stringify({type: 'kolb1',
                           q1: block.getFieldValue('q1'),
                           q2: block.getFieldValue('q2'),
                           q3: block.getFieldValue('q3'),
                           q4: block.getFieldValue('q4')
                          })
  }
},

load: {
  "blocks": {
      "languageVersion": 0,
      "blocks": [
          {
              "type": "question",
              "id": "H$U1DMUP3EK!G$5`/GjB",
              "x": 23,
              "y": 9
          },
          {
              "type": "op1",
              "id": "H(bRBx{cAi_mpNnS3}BP",
              "x": 21,
              "y": 200
          },
          {
              "type": "op2",
              "id": "a]iO7E/iT6n_$=Htw!YG",
              "x": 350,
              "y": 200
          },
          {
              "type": "op3",
              "id": "mBi=wCrgn|hod+#8Z^VT",
              "x": 21,
              "y": 230
          },
          {
              "type": "op4",
              "id": "XH6!ppHJY`EMt2zYAJB@",
              "x": 350,
              "y": 230
          }
      ]
  }
}

})