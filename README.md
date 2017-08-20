
# yagg [![Build Status][travis]][travis-url]
Yet Another Great Generator

## Getting Started
You will need Node >= 6 installed. [How do I install node? click here to find out about nvm](https://github.com/creationix/nvm#installation)

### Installation
Install the yagg globally
```sh
npm install -g yagg
```

Add the sample template
```sh
yagg add custom
```

### Create a new project from template
```sh
yagg new custom

sample-express
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

## Changelog
[https://github.com/g3org3/yagg/blob/master/CHANGELOG.md](https://github.com/g3org3/yagg/blob/master/CHANGELOG.md)

## Contributors
* George <7jagjag@gmail.com>

[travis]: https://travis-ci.org/g3org3/yagg.svg?branch=master
[travis-url]: https://travis-ci.org/g3org3/yagg
