#! /usr/bin/env node

const Utils = require('../utils')()
const logger = Utils.logger
const Shell = Utils.shell
const GENERAL = Utils.Errors.types.GENERAL
const program = require('commander')
const version = require('../package.json').version

program
  .version(version)

program
  .command('run <generator>')
  .description('run a custom generator')
  .action(function (generator, options) {
    getDeps().then(deps => {
      const index = deps.map(dep => dep.id).indexOf(`yagg-${generator}`)
      if (index === -1) {
        console.log('\n No available generators')
        console.log('\n\n')
        return
      }
      const yaggGenerator = deps[index].id
      Shell(`${yaggGenerator}`)
      .then(console.log)
      .catch(err => logger.error(err, GENERAL, { name: yaggGenerator}))
    })
  });

program
  .command('remove <generator>')
  .description('remove a custom generator')
  .action(function (generator, options) {
    Shell(`npm uninstall -g yagg-${generator}`)
    .then(console.log)
    .catch(err => logger.error(err, GENERAL, { name: yaggGenerator}))
  });

program
  .command('add <generator>')
  .description('add a custom generator')
  .action(function (generator, options) {
    Shell(`npm install -g yagg-${generator}`)
    .then(console.log)
    .catch(err => logger.error(err, GENERAL, { name: yaggGenerator}))
  });

program
  .command('list')
  .description('list all available generators')
  .option('-v, --verbose', 'display more info in any command')
  .action(function (options) {
    getDeps().then(deps => {
      if (deps.length === 0) {
        console.log('\n No available generators')
        console.log('\n\n')
        return
      }
      console.log('\n Available generators')
      console.log('------------------------')
      deps.map(dep => {
        if (options.verbose)
          console.log(`  - ${dep.id}: ${dep.version}`)
        else
          console.log(`  - ${dep.id}`)
      })
      console.log('\n\n')
    })
  });

program.parse(process.argv);

// move to utils
function getDeps() {
  return Shell('npm list -g --depth=0 --json=true')
  .then(rawOutput => {
    const globalPackgeJson = JSON.parse(rawOutput)
    const depsKeys = Object.keys(globalPackgeJson.dependencies)
    .filter(key => key.indexOf('yagg') !== -1)
    .filter(key => key !== 'yagg')
    .map(key => {
      const _dep = globalPackgeJson.dependencies[key]
      _dep.id = key
      return _dep
    })
    return depsKeys
  })
  .catch(err => logger.error(err, GENERAL))
}