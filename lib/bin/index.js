#! /usr/bin/env node

const Utils = require('../utils')
const logger = Utils.logger
const GENERAL = Utils.errors.types.GENERAL
const getDeps = Utils.getDeps
const program = require('commander')
const version = require('../../package.json').version
const path = require('path')
// const spawn = require('child_process').spawn
const shell = require('../utils/shell')
// const execSync = require('child_process').execSync

const template = require('../')

program
  .version(version)
  .option('-v, --version', 'output the version number')

program
  .command('run <generator>')
  .description('run a custom generator')
  .option('-p, --path', 'use a path to search the template')
  .action(function (name, {path: isPath}) {
    const pwd = process.cwd()
    if (isPath && !path.isAbsolute(name)) {
      name = path.resolve(pwd, name)
    }
    Promise.resolve(isPath ? name : `yagg-${name}`)
      .then(pathTemplate => require(pathTemplate))
      .then(config => template.setup(Object.assign(config, { pwd })))
      .then(template => template.run())
      .catch(err => logger.error(err, GENERAL, { name }))
  })

program
  .command('remove <generator>')
  .description('remove a custom generator')
  .action(function (generator, options) {
    shell(`npm uninstall -g yagg-${generator}`)
      .then(console.log)
      .catch(err => logger.error(err, GENERAL, { name: generator }))
  })

program
  .command('add <generator>')
  .description('add a custom generator')
  .action(function (generator, options) {
    shell(`npm install -g yagg-${generator}`)
      .then(console.log)
      .catch(err => logger.error(err, GENERAL, { name: generator }))
  })

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
        if (options.verbose) { console.log(`  - ${dep.id}: ${dep.version}`) } else { console.log(`  - ${dep.id}`) }
      })
      console.log('\n\n')
    })
  })

program.parse(process.argv)
