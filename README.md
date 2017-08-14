# @g3org3/generator

more info soon

## How can I create my custom generator
```javascript
/* /index.js */

#! /usr/bin/env node

const _gen = require('@g3org3/generator')(__dirname)

// My Custom Generator
const context = {
  image: 'registry.jorgeadolfo.com/name',
  port: '8000'
}

// copies the entire file structure in ./app
_gen.cloneTemplateStructure(context)
```

File Structure
```bash
├── app
│   ├── docker
│   │   ├── Dockerfile
│   └── src
│       ├── MyApp.js
│       └── utils
│           └── index.js
├── index.js
└── package.json
```