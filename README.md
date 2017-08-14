# Generator

more info soon

## Usage
```javascript
#! /usr/bin/env node

const _gen = require('@g3org3/generator')(__dirname)

// My Custom Generator
const context = {
  image: 'registry.jorgeadolfo.com/name',
  ports: '8000'
}

_gen.cloneTemplateStructure(context)
```