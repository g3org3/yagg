#! /usr/bin/env node

const Utils = require('../utils')()
const logger = Utils.logger
const Shell = Utils.shell
const GENERAL = Utils.Errors.types.GENERAL
const getDeps = Utils.getDeps
const program = require('commander')
const version = require('../package.json').version

program
  .version(version)

program
  .command('run <generator>')
  .description('run a custom generator')
  .action(function (generator, options) {
    Shell(`yagg-${generator}`)
    .then(console.log)
    .catch(err => {
      if (err.message.indexOf('command not found') === -1) {
        logger.error(err, GENERAL, { name: generator})
        return
      }
      console.log(`\n No available generator ${generator}`)
      console.log('\n\n')
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
    console.log('Searching for generator...  this might take a minute')
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
