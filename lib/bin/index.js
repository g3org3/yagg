#! /usr/bin/env node

const Utils = require('../utils')
const logger = Utils.logger
const GENERAL = Utils.errors.types.GENERAL
const getDeps = Utils.getDeps
const program = require('commander')
const version = require('../../package.json').version
const spawn = require('child_process').spawn
const execSync = require('child_process').execSync

program
  .version(version)

program
  .command('run <generator>')
  .description('run a custom generator')
  .action(function (generator, options) {
    const yaggGenerator = `yagg-${generator}`
    const cmd = spawn(yaggGenerator, { stdio: 'inherit' })
    cmd.on('error', (err) => {
      if (err.message.indexOf('ENOENT') === -1) {
        logger.error(err, 1)
      } else {
        console.log('Generator not found,', yaggGenerator, err)
      }
    })
    cmd.on('close', code => {
      if (code === 0) console.log('done!')
    })
  });

program
  .command('remove <generator>')
  .description('remove a custom generator')
  .action(function (generator, options) {
    Shell(`npm uninstall -g yagg-${generator}`)
    .then(console.log)
    .catch(err => logger.error(err, GENERAL, { name: generator}))
  });

program
  .command('add <generator>')
  .description('add a custom generator')
  .action(function (generator, options) {
    Shell(`npm install -g yagg-${generator}`)
    .then(console.log)
    .catch(err => logger.error(err, GENERAL, { name: generator}))
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
