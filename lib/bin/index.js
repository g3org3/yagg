#! /usr/bin/env node

/**
 * Dependencies
 */
const chalk = require('chalk')
const program = require('commander')
const spawn = require('child_process').spawn
const utils = require('../utils')
const version = require('../../package.json').version

/**
 * Utils
 */
const logger = utils.logger
const ErrorType = utils.errors.types
const getGlobalDependencies = utils.getGlobalDependencies
const execPromise = utils.execPromise
const highlight = utils.highlight

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
        logger.error(err, ErrorType.GENERAL)
      } else {
        logger.warning(`Generator not found ${highlight(yaggGenerator)}`, err)
      }
    })
    cmd.on('close', code => {
      if (code === 0) {
        console.log()
        console.log(chalk.cyan('... Done 🚀'))
        console.log()
      }
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
      .then(() => {
        logger.success(`- yagg-${generator} ${chalk.red('removed')}! ✅`)
      })
      .catch(err => {
        if (err.message.indexOf(`Cannot read property 'path' of null`) === -1) {
          logger.error(err, ErrorType.GENERAL, { name: generator })
        } else {
          logger.warning(`Generator not found ${highlight(`yagg-${generator}`)}`, err)
        }
      })
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
      .then(() => {
        logger.success(`+ yagg-${generator} ${chalk.green('added')}! ✅`)
        console.log(chalk.dim(`*how to use?: $ yagg run ${generator}`))
      })
      .catch(err => {
        if (err.message.indexOf(`Cannot read property 'path' of null`) === -1) {
          logger.error(err, ErrorType.GENERAL, { name: generator })
        } else {
          logger.warning(`Generator not found ${highlight(`yagg-${generator}`)}`, err)
        }
      })
  })

/**
 * listCmd
 *
 * @param {object} options
 */
program
  .command('list')
  .description('list all available generators')
  .option('--verbose', 'display more info in any command')
  .action(function listCmd (options) {
    console.log('Searching 🔦 ')
    console.log('for generators...  give me a minute ⏱')
    getGlobalDependencies().then(deps => {
      console.log()
      if (deps.length === 0) {
        console.log('No available generators')
        return
      }
      console.log('Available generators')
      console.log('------------------------')
      deps.map(dep => {
        const name = dep.id.substr('yagg-'.length)
        const generator = (options.verbose) ? ` - ${dep.id}: ${dep.version}` : ` - ${name}`
        console.log(generator)
      })
      console.log()
    })
  })

program.parse(process.argv)

process.on('exit', function exitHandler () {
  process.exit()
})
// catch ctrl+c event and exit normally
process.on('SIGINT', function () {
  console.log(' Ctrl-C...')
  logger.error(new Error('Ctrl-C'), ErrorType.USER_QUIT)
})
