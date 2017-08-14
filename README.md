# yagg
Yet Another Great Generator
more info soon

## Usage
```sh
# instal cli
npm install -g yagg

# add yagg-custom generator
yagg add custom

mkdir yagg-tutorial
yagg run custom
```

## How can I create my custom generator
```javascript
/* /index.js */

#! /usr/bin/env node

const _gen = require('yagg')(__dirname)

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