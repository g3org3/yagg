# yagg
Yet Another Great Generator
more info soon

## Getting Started
You will need Node >= 6 installed. [How do I install node? click here to find out about nvm](https://github.com/creationix/nvm#installation)

### Installation
Install the yagg globally
```sh
npm install -g yagg
```

Add the sample generator
```sh
yagg add custom
```

### Create a sample generator
```sh
mkdir sample-express
yagg run custom

sample-express
├── app
│   └── server.js
├── index.js
├── node_modules
├── package.json
└── yarn.lock
```

### yagg cli help
```

  Usage: yagg [options] [command]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    run <generator>     run a custom generator
    remove <generator>  remove a custom generator
    add <generator>     add a custom generator
    list [options]      list all available generators
```

## Changelog
[https://github.com/g3org3/yagg/blob/master/CHANGELOG.md](https://github.com/g3org3/yagg/blob/master/CHANGELOG.md)

## API
* cloneTemplateStructure
* installDeps

## Contributors
* George <7jagjag@gmail.com>