const path = require('path')

const { logger } = require('../utils')
const { types: errorTypes } = require('../utils/errors')
const { generators } = require('../utils/storage')
const validations = require('../utils/validations')

const LABEL = 'Register a local generator'
const WHERE_IS_IT = 'WHERE_IS_IT'

function action (modulePath) {
  let absolutePath = path.isAbsolute(modulePath)
    ? modulePath
    : path.resolve(modulePath)

  try {
    const generatorConfig = require(absolutePath)
    const { error } = validations.generatorConfig(generatorConfig)
    if (error) {
      return logger.error(error, errorTypes.BAD_GENERATOR_CONFIG, {
        config: generatorConfig
      })
    }
    if (generators.find({ name: absolutePath }).value()) {
      return logger.info(`'${modulePath}' is already saved`)
    }
    generators.push({ name: absolutePath }).write()

    logger.info(`'${modulePath}' is saved`)
  } catch (error) {
    logger.error(error, errorTypes.BAD_PATH, { path: modulePath })
  }
}

const question = {
  type: 'input',
  name: WHERE_IS_IT,
  message: 'Where is the generator?'
}

function when (answers) {
  const exec = answers.action === LABEL
  if (!exec) {
    this.position = -1
  }

  return exec
}

function listen (answers) {
  const modulePath = answers[WHERE_IS_IT]
  if (typeof modulePath === 'string') {
    action(modulePath)
  }
}

module.exports = {
  listen,
  label: LABEL,
  question: Object.assign({}, question, { when })
}
