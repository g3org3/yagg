#! /usr/bin/env node

const program = require('commander')
const Enquirer = require('enquirer')
const version = require('../../package.json').version
const { logger, errors } = require('../utils')

const actions = require('../actions')

const ErrorType = errors.types
const enquirer = new Enquirer()

enquirer.register('radio', require('prompt-radio'))
enquirer.register('list', require('prompt-list'))

program.version(version).option('-v, --version', 'output the version number')

actions.createProject.command(program)
actions.listGenerators.command(program)
actions.installGenerator.command(program)

program.parse(process.argv)

const questions = [
  {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      actions.createProject.label,
      actions.installGenerator.label,
      actions.register.label
      // actions.listGenerators.label
    ]
  }
]
  .concat(actions.installGenerator.question)
  .concat(actions.register.question)
  .concat(actions.listGenerators.question)

if (process.argv.length === 2) {
  enquirer
    .ask(questions)
    .then(answers => {
      actions.installGenerator.listen(answers)
      actions.register.listen(answers)
      actions.listGenerators.listen(answers)
    })
    .catch(err => {
      console.log(err)
    })
}

// catch ctrl+c event and exit normally
process.on('SIGINT', function () {
  console.log(' Ctrl-C...')
  logger.error(new Error('Ctrl-C'), ErrorType.USER_QUIT)
})
