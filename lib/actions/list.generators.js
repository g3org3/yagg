const storage = require('../utils/storage')
const { getNpmPaths, findGeneratorsIn } = require('../utils')
const Enquirer = require('enquirer')
const enquirer = new Enquirer()

const actions = require('../actions')

enquirer.register('radio', require('prompt-radio'))
enquirer.register('list', require('prompt-list'))

const LABEL = 'List the registered generators'

const WHICH_ONE = 'WHICH_ONE'

const generatorsList = storage.generators
  .value()
  .map(generator => generator.name)
  .concat(findGeneratorsIn(getNpmPaths()))
  .reduce(function (generatorsList, generatosPath) {
    generatorsList[require(generatosPath).name || generatosPath] = generatosPath
    return generatorsList
  }, {})

function action (generator) {
  actions.createProject.action(generator, process.cwd())
}

const question = {
  type: 'list',
  name: WHICH_ONE,
  message: 'Which generator do you want to use?',
  choices: Object.keys(generatorsList)
}

function when (answers) {
  const exec = (
    answers.action === LABEL || actions.createProject.label === answers.action
  )

  if (!exec) {
    this.position = -1
  }
  return exec
}

function listen (answers) {
  const generator = answers[WHICH_ONE]
  if (typeof generator === 'string') {
    action(generatorsList[generator])
  }
}

function command (program) {
  program
    .command('list')
    .description('list all available templates')
    .action(() => {
      enquirer
        .ask(question)
        .then(answers => listen(answers))
        .catch(err => console.log(err))
    })
}

module.exports = {
  command,
  action,
  listen,
  label: LABEL,
  question: Object.assign({}, question, { when })
}
