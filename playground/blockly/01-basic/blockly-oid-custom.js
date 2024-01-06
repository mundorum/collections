import { Oid } from '/pack/oid-full-dev.js'

Oid.customize('boid:blockly', {

cid: 'heart',

toolbox: {
  'kind': 'categoryToolbox',
  'contents': [
    {
      'kind': 'category',
      'name': 'Heart',
      'contents': [
        {
          'kind': 'block',
          'type': 'heart'
        },
        {
          'kind': 'block',
          'type': 'heart_image'
        },
        {
          'kind': 'block',
          'type': 'sequence'
        }
      ],
      'colour': 300
    }
  ]
},

blocks:
[
  {
    'type': 'heart',
    'message0': 'The heart is %1 %2',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'state',
        'options': [
          ['parado', 'stopped'],
          ['batendo', 'beating'],
          ['desconhecido', 'unknown']
        ]
      },
      {
        'type': 'input_value',
        'name': 'image',
        'check': 'HImage'
      }
    ],
    'message1': 'rhythm %1',
    'args1': [
      {
        'type': 'field_number',
        'name': 'rhythm',
        value: 100,
        min: 0,
        max: 100
      }
    ],
    'message2': '%1 healthy',
    'args2': [
      {
        'type': 'field_checkbox',
        'name': 'healthy',
        'check': 'Boolean'
      }
    ],
    'colour': 160,
    'tooltip': 'Coração'
  },

  {
    'type': 'heart_image',
    'message0': '%1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'entity',
        'options': [
          [{src: 'images/heart1.svg', width: 100, height: 100, alt: 'heart 1'}, 'heart1'],
          [{src: 'images/heart2.svg', width: 100, height: 100, alt: 'heart 2'}, 'heart2']
        ]
      }
    ],
    'colour': 200,
    'tooltip': 'Heart Image',
    'output': 'HImage'
  },

  {
    'type': 'sequence',
    'message0': '%1 onda %2 elétrico',
    'args0': [
      {
        'type': 'input_value',
        'name': 'VALUE',
        'check': 'HImage'
      },
      {
        'type': 'input_value',
        'name': 'VALUE',
        'check': 'HImage'
      },
    ],
    colour: 250
  }
],

generator: {
  'heart': function (block, generator) {
    const state = block.getFieldValue('state')
    const rhythm = block.getFieldValue('rhythm')
    const healthy = block.getFieldValue('healthy')
    return JSON.stringify({type: 'heart',
            state: state,
            rhythm: rhythm,
            healthy: healthy})
  },
  
  'heart_image': function (block, generator) {
    const entity = block.getFieldValue('entity')
    return `heart image ${entity}`
  },
  
  'sequence': function (block, generator) {
    return `sequence`
  }
}

})