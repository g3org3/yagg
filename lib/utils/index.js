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
  info: function () {
    const args = Object.keys(arguments).map(key => arguments[key]).join('\n  ')
    console.log(' ', args)
    console.log(chalk.dim('---------------------------------'))
    return args
  },
  success: (message) => {
    console.log()
    console.log(chalk.dim('------ YAGG --------'))
    if (!message) return
    console.log(message)
    console.log()
  },
  error: (err, code, moreinfo) => {
    console.error()
    console.error(chalk.dim('------ YAGG - Something went wrong 💢 --------'))
    if (isVerboseEnabled) {
      if (moreinfo) {
        console.error(chalk.bold('Extra info:'))
        console.error(chalk.yellow(JSON.stringify(moreinfo, null, 2)))
        console.error()
      }
      console.error(chalk.bold('Error message:'))
      console.error(chalk.yellow(err.message))
      console.error()
      console.error(chalk.bold('Raw Error:'))
      console.error(err)
    } else {
      console.error(chalk.bold(ErrorDetail[code]))
      console.error()
      console.error(chalk.dim('export YAGG_DEBUG=verbose and re-run last command for non-friendly info'))
    }
    console.error(chalk.dim(`----------- internal exit code ${code || 1} ----------`))
    console.error()
    process.exit(code)
  },
  warning: (message, err, moreinfo) => {
    console.error()
    console.error(chalk.dim('------ YAGG - warning --------'))
    if (isVerboseEnabled) {
      if (moreinfo) {
        console.error(chalk.bold('Extra info:'))
        console.error(chalk.yellow(JSON.stringify(moreinfo, null, 2)))
      }
      console.error(err)
    } else {
      console.error(chalk.bold(message))
    }
    console.error()
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
    let args = (useYarn) ? [] : ['install']
    if (list && list.length > 1) {
      args = (useYarn) ? ['add'] : ['install', '--save']
      if (options && options.dev) {
        if (!useYarn) args.pop()
        args = (useYarn) ? args.concat('--dev') : args.concat(['--save-dev'])
      }
      args.concat(list)
    }
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
    let value = replaceAll(context[key].toString(), '\\.', '\\\\.')
    value = replaceAll(value, ' ', '\\ ')
    const pipe = (index === 0) ? ' |' : ''
    return `${pipe} sed s.#{${key}}.${value}.g`
  }).join(' |')
}

exports.replaceAll = replaceAll
function replaceAll (target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement)
}

exports.highlight = function highlight (message) {
  const backQuote = chalk.cyan('`')
  const msg = chalk.cyan(message)
  return `${backQuote}${msg}${backQuote}`
}

exports.errors = require('./errors')
