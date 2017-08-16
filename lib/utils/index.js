/**
 * Dependencies
 */
const chalk = require('chalk')
const exec = require('child_process').exec
const execSync = require('child_process').execSync
const spawn = require('child_process').spawn

/**
 * Constants
 */
const ErrorDetail = require('./errors').details
const ErrorType = require('./errors').types
const isTest = process.env.NODE_ENV === 'test'
const isVerboseEnabled = process.env.YAGG_DEBUG === 'verbose'

/**
 * execPromise
 *
 * @param {string} command
 * @returns {Promise} stdout or stderr if fails
 */
function execPromise (cmd) {
  if (isTest) {
    return Promise.resolve(cmd)
  }
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err || stderr) reject(err || stderr)
      else resolve(stdout)
    })
  })
}
exports.execPromise = execPromise

/**
 * logger
 */
const logger = {
  info: () => {
    const args = Object.keys(arguments).map(key => arguments[key]).join('\n  ')
    console.log('---------------------------------')
    console.log(' ', args)
    console.log('---------------------------------')
    return args
  },
  error: (err, code, moreinfo) => {
    console.error(chalk.red('\n--------------------------------------'))
    console.error(chalk.red(' - Error Found! -'))
    console.error(chalk.bold('  Message:'), err.message)
    console.error(chalk.bold('  Details:'), ErrorDetail[code])
    if (isVerboseEnabled) {
      console.error(chalk.bold('  moreinfo:'))
      console.error(chalk.yellow(JSON.stringify(moreinfo, null, 2)))
      console.error(err)
    }
    console.error(chalk.red(`----------- exit code ${code || 1} ------------`))
    process.exit(code)
  }
}
exports.logger = logger

/**
 * getGlobalDependencies
 *
 * @returns {Array} dependencies
 */
exports.getGlobalDependencies = function getGlobalDependencies () {
  return execPromise('npm list -g --depth=0 --json=true')
    .then(rawOutput => {
      const globalPackgeJson = JSON.parse(rawOutput)
      const depsKeys = Object.keys(globalPackgeJson.dependencies)
        .filter(key => key.indexOf('yagg') !== -1)
        .filter(key => key !== 'yagg')
        .map(key => {
          const _dep = globalPackgeJson.dependencies[key]
          _dep.id = key
          return _dep
        })
      return depsKeys
    })
    .catch(err => logger.error(err, ErrorType.GET_DEPS))
}

exports.sanitize = function sanitize (name) {
  if (!name) return ''

  let _name = name
  const firstChar = _name.substr(0, 1)
  const lastChar = _name.substr(_name.length - 1)

  // remove first slash
  _name = (firstChar === '/') ? name.substr(1) : name
  // remove last slash
  _name = (lastChar === '/') ? _name.substr(0, _name.length - 1) : _name

  return _name
}

/**
 * installDependencies
 *
 * @param {Array} list
 * @param {Object} options
 * @returns {Promise} exit code
 */
exports.installDependencies = function installDeps (list, options) {
  return new Promise((resolve, reject) => {
    const useYarn = isYarnAvailable()
    const npm = (useYarn) ? 'yarn' : 'npm'
    const args = (useYarn) ? ['add'] : ['install', '--save']

    const command = spawn(npm, args, { stdio: 'inherit' })
    command.on('error', reject) // handle error with logger?
    command.on('close', code => {
      if (code === 0) {
        resolve(0)
      }
    })
  })
}

function isYarnAvailable () {
  try {
    execSync('yarn --version')
    return true
  } catch (e) {
    return false
  }
}

exports.transformContextIntoSedString = function transformContextIntoSedString (context) {
  if (!context || typeof context === 'string') return ''
  return Object.keys(context).map((key, index) => {
    const value = replaceAll(context[key].toString(), '\\.', '\\\\.')
    const pipe = (index === 0) ? ' |' : ''
    return `${pipe} sed s.#{${key}}.${value}.g`
  }).join(' |')
}

exports.replaceAll = replaceAll
function replaceAll (target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement)
}

exports.errors = require('./errors')
