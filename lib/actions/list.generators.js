const storage = require('../utils/storage')
const { getNpmPaths, findGeneratorsIn } = require('../utils')
const Enquirer = require('enquirer')
const enquirer = new Enquirer()

enquirer.register('radio', require('prompt-radio'))
enquirer.register('list', require('prompt-list'))

const LABEL = 'List the registered generators'

const WHICH_ONE = 'WHICH_ONE'

function action (generator) {
  console.log('I`m going to run ' + generator)
}

const generatorsList = storage.generators
  .value()
  .map(generator => generator.name)
  .concat(findGeneratorsIn(getNpmPaths()))
  .reduce(function (generatorsList, generatosPath) {
    generatorsList[require(generatosPath).name || generatosPath] = generatosPath
    return generatorsList
  }, {})

const question = {
  type: 'list',
  name: WHICH_ONE,
  message: 'Which generator do you want to use?',
  choices: Object.keys(generatorsList)
}

function when (answers) {
  return answers.action === LABEL
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
    .option('--verbose', 'display more info in any command')
    .option(
      '-c, --choose',
      'choose a template from the list to start your project'
    )
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
