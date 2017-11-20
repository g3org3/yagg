const chalk = require('chalk')
const { logger, errors, execPromise, highlight } = require('../utils')

const ErrorType = errors.types

const LABEL = 'Install a generator'

const GENERATOR_NAME = 'GENERATOR_NAME'

const question = {
  type: 'input',
  name: GENERATOR_NAME,
  message: 'What is the generator name?'
}

function when (answers) {
  const exec = answers.action === LABEL
  if (!exec) {
    this.position = -1
  }
  return exec
}

function action (name) {
  execPromise(`npm install -g yagg-${name}`)
    .then(() => {
      logger.success(`+ yagg-${name} ${chalk.green('added')}! ✅`)
      console.log(chalk.dim(`*how to use?: $ yagg new ${name}`))
    })
    .catch(err => {
      if (err.message.indexOf(`Cannot read property 'path' of null`) === -1) {
        logger.error(err, ErrorType.GENERAL, { name: name })
      } else {
        logger.warning(`template not found ${highlight(`yagg-${name}`)}`, err)
      }
    })
}

function command (program) {
  program
    .command('add <generator>')
    .description('add a generator')
    .action(generator => {
      action(generator)
    })
}

function listen (answers) {
  const generatorName = answers[GENERATOR_NAME]
  if (typeof modulePath === 'string') {
    action(generatorName)
  }
}

module.exports = {
  listen,
  command,
  action,
  label: LABEL,
  question: Object.assign({}, question, { when })
}
