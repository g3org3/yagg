[![Build Status][travis]][travis-url]
[![npm package][npm-image]](npm-url)

# YAGG
Yet Another Great Generator - 
✨🚀 Simple and fast generator, create your own template in seconds

## Getting Started
You will need Node >= 6 installed. [How do I install node? click here to find out about nvm](https://github.com/creationix/nvm#installation)

### Installation
Install the yagg globally
```sh
npm install -g yagg
```

## Usage
Add the template
```sh
yagg add custom
```

Now create a new project from template
```sh
yagg new custom
? What is the project name? sample-app
? Enter a small description A sample template with yagg
? Enter your email 7jagjag@gmail.com
? Enter your name George

------ YAGG --------
 create dir: [ ✅  ] ./sample-app/app
 create dir: [ ✅  ] ./sample-app
  copy file: [ ✅  ] index.js
  copy file: [ ✅  ] server.js
  copy file: [ ✅  ] package.json

Success! ✨🌟 happy coding 🎉
  cd sample-app
```

outputs
```sh
sample-app
├── app
│   └── server.js
├── index.js
├── node_modules
└── package.json
```

### yagg cli help
```

  Usage: yagg [options] [command]


  Options:

    -V, --version  output the version number
    -v, --version  output the version number
    -h, --help     output usage information


  Commands:

    new [options] <template> [projectName]  create a new project from a template
    remove <template>                       remove a template
    add <template>                          add a template
    list [options]                          list all available templates
```
## Development
Fork, then clone the repo:
```sh
git clone https://github.com/your-username/yagg.git
cd yagg
git remote set-url g3 https://github.com/g3org3/yagg.git
npm install
npm link
yagg --help
```


## Changelog
[https://github.com/g3org3/yagg/blob/master/CHANGELOG.md](https://github.com/g3org3/yagg/blob/master/CHANGELOG.md)

## Contributors
* George <7jagjag@gmail.com>

[travis]: https://travis-ci.org/g3org3/yagg.svg?branch=master
[travis-url]: https://travis-ci.org/g3org3/yagg
[npm-image]: https://img.shields.io/npm/v/yagg.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/yagg
