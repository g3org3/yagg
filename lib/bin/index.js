#! /usr/bin/env node

/**
 * Dependencies
 */
const program = require('commander')
const spawn = require('child_process').spawn
const utils = require('../utils')
const version = require('../../package.json').version

/**
 * Utils
 */
const logger = utils.logger
const GENERAL = utils.errors.types.GENERAL
const getDeps = utils.getDeps
const execPromise = utils.execPromise

/**
 * CLI
 */
program
  .version(version)
  .option('-v, --version', 'output the version number')

/**
 * runCmd
 *
 * @param {string} generator
 * @param {object} options
 */
program
  .command('run <generator>')
  .description('run a custom generator')
  .action(function runCmd (generator, options) {
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
  })

/**
 * removeCmd
 *
 * @param {string} generator
 * @param {object} options
 */
program
  .command('remove <generator>')
  .description('remove a custom generator')
  .action(function removeCmd (generator, options) {
    execPromise(`npm uninstall -g yagg-${generator}`)
      .then(console.log)
      .catch(err => logger.error(err, GENERAL, { name: generator }))
  })

/**
 * addCmd
 *
 * @param {string} generator
 * @param {object} options
 */
program
  .command('add <generator>')
  .description('add a custom generator')
  .action(function addCmd (generator, options) {
    execPromise(`npm install -g yagg-${generator}`)
      .then(console.log)
      .catch(err => logger.error(err, GENERAL, { name: generator }))
  })

/**
 * listCmd
 *
 * @param {object} options
 */
program
  .command('list')
  .description('list all available generators')
  .option('-v, --verbose', 'display more info in any command')
  .action(function listCmd (options) {
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
