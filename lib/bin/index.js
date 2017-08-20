#! /usr/bin/env node

/**
 * Dependencies
 */
const chalk = require('chalk')
const program = require('commander')
const version = require('../../package.json').version
const path = require('path')
// const spawn = require('child_process').spawn
const utils = require('../utils')
// const execSync = require('child_process').execSync

const template = require('../')
const logger = utils.logger
const ErrorType = utils.errors.types
const getGlobalDependencies = utils.getGlobalDependencies
const execPromise = utils.execPromise
const highlight = utils.highlight
program
  .version(version)
  .option('-v, --version', 'output the version number')

/**
 * runCmd
 *
 * @param {string} template
 * @param {object} options
 */
program
  .command('new <template>')
  .description('create a new project from a template')
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
      .catch(err => logger.error(err, ErrorType.GENERAL, { name }))
  })

/**
 * removeCmd
 *
 * @param {string} template
 * @param {object} options
 */
program
  .command('remove <template>')
  .description('remove a template')
  .action(function removeCmd (template, options) {
    execPromise(`npm uninstall -g yagg-${template}`)
      .then(() => {
        logger.success(`- yagg-${template} ${chalk.red('removed')}! ✅`)
      })
      .catch(err => {
        if (err.message.indexOf(`Cannot read property 'path' of null`) === -1) {
          logger.error(err, ErrorType.GENERAL, { name: template })
        } else {
          logger.warning(`template not found ${highlight(`yagg-${template}`)}`, err)
        }
      })
  })

/**
 * addCmd
 *
 * @param {string} template
 * @param {object} options
 */
program
  .command('add <template>')
  .description('add a template')
  .action(function addCmd (template, options) {
    execPromise(`npm install -g yagg-${template}`)
      .then(() => {
        logger.success(`+ yagg-${template} ${chalk.green('added')}! ✅`)
        console.log(chalk.dim(`*how to use?: $ yagg run ${template}`))
      })
      .catch(err => {
        if (err.message.indexOf(`Cannot read property 'path' of null`) === -1) {
          logger.error(err, ErrorType.GENERAL, { name: template })
        } else {
          logger.warning(`template not found ${highlight(`yagg-${template}`)}`, err)
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
  .description('list all available templates')
  .option('--verbose', 'display more info in any command')
  .action(function listCmd (options) {
    console.log('Searching 🔦 ')
    console.log('for templates...  give me a minute ⏱')
    getGlobalDependencies().then(deps => {
      console.log()
      if (deps.length === 0) {
        console.log('No available templates')
        return
      }
      console.log('Available templates')
      console.log('------------------------')
      deps.map(dep => {
        const name = dep.id.substr('yagg-'.length)
        const template = (options.verbose) ? ` - ${dep.id}: ${dep.version}` : ` - ${name}`
        console.log(template)
      })
      console.log()
    })
  })

program.parse(process.argv)

// catch ctrl+c event and exit normally
process.on('SIGINT', function () {
  console.log(' Ctrl-C...')
  logger.error(new Error('Ctrl-C'), ErrorType.USER_QUIT)
})
