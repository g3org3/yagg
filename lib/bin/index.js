#! /usr/bin/env node

/**
 * Dependencies
 */
const chalk = require('chalk')
const program = require('commander')
const Enquirer = require('enquirer')
const version = require('../../package.json').version
const path = require('path')
// const spawn = require('child_process').spawn
const utils = require('../utils')
// const execSync = require('child_process').execSync

const yagg = require('../')
const logger = utils.logger
const ErrorType = utils.errors.types
const getGlobalDependencies = utils.getGlobalDependencies
const execPromise = utils.execPromise
const highlight = utils.highlight
const enquirer = new Enquirer()

enquirer.register('radio', require('prompt-radio'))

program.version(version).option('-v, --version', 'output the version number')

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
  .option('-n, --name <projectName>', 'name of your new project')
  .action(newTemplate)
function newTemplate (template, { path: isPath, name: projectName }) {
  const pwd = process.cwd()
  projectName = typeof projectName === 'function' ? null : projectName
  if (isPath && !path.isAbsolute(template)) {
    template = path.resolve(pwd, template)
  }
  Promise.resolve(isPath ? template : `yagg-${template}`)
    .then(pathTemplate => require(pathTemplate))
    .then(config => yagg.setup(Object.assign(config, { pwd, projectName })))
    .then(yagg => yagg.run())
    .catch(err => logger.error(err, ErrorType.GENERAL, { template }))
}

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
          logger.warning(
            `template not found ${highlight(`yagg-${template}`)}`,
            err
          )
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
        console.log(chalk.dim(`*how to use?: $ yagg new ${template}`))
      })
      .catch(err => {
        if (err.message.indexOf(`Cannot read property 'path' of null`) === -1) {
          logger.error(err, ErrorType.GENERAL, { name: template })
        } else {
          logger.warning(
            `template not found ${highlight(`yagg-${template}`)}`,
            err
          )
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
  .option(
    '-c, --choose',
    'choose a template from the list to start your project'
  )
  .action(function listCmd ({
    verbose: isVerbose,
    choose: wantsToChooseTemplate
  }) {
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
      const templates = deps.map(dep => {
        const name = dep.id.substr('yagg-'.length)
        const template = isVerbose
          ? ` - ${dep.id}: ${dep.version}`
          : ` - ${name}`
        console.log(template)
        return name
      })

      if (wantsToChooseTemplate) {
        const question = {
          name: 'template',
          message: 'choose your template',
          type: 'radio',
          choices: templates
        }
        enquirer.ask([question]).then(answers => {
          newTemplate(answers.template, { path: false, name: null })
        })
      }

      console.log()
    })
  })

program.parse(process.argv)

// catch ctrl+c event and exit normally
process.on('SIGINT', function () {
  console.log(' Ctrl-C...')
  logger.error(new Error('Ctrl-C'), ErrorType.USER_QUIT)
})
