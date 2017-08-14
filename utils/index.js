String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

module.exports = function (_dirname) {
  const Exec = require('child_process').exec
  const Chalk = require('chalk')
  const envInfo = require('./envInfo')(_dirname)
  const Errors = require('./Errors')
  const ErrorDetail = Errors.details
  const ErrorType = Errors.types
  const CURRENT_DIR = envInfo.CURRENT_DIR
  const SCRIPTS_DIR = envInfo.SCRIPTS_DIR
  const CURRENT_DIR_NAME = envInfo.CURRENT_DIR_NAME

  /**
   * sanitize
   * 
   * @param {string} name 
   * @returns {string} name
   */
  function sanitize(name) {
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

  function transformContextIntoSedString(context) {
    if (!context || typeof context === 'string') return ''

    return Object.keys(context).map((key, index) => {
      const value = context[key].toString().replaceAll('\\.', '\\\\.')
      const pipe = (index === 0)? ' |' : ''
      return `${pipe} sed s.#{${key}}.${value}.g`
    }).join(' |')
  }

  function parseWorkingDir (dir) {
    const _subdir = sanitize(dir) + '/'
    const _path = `${SCRIPTS_DIR}/app/${_subdir}`
    
    return shell(`ls -lA ${_path}`).then(rawOutput => {
      const lines = rawOutput.split('\n')
      const filteredLines = lines.slice(1, lines.length - 1)
      const filesAndDirs = filteredLines.map(line => {
        const fields = line.split(' ')
        return {
          info: fields[0],
          isFolder: fields[0].substr(0, 1) === 'd',
          name: `${_subdir}${fields[fields.length - 1]}`
        }
      })
      return filesAndDirs;
    })
    .catch(err => logger.error(err, ErrorType.LIST_DIR))
  }

  function shell (cmd) {
    return new Promise((resolve, reject) => {
      Exec(cmd, (err, stdout, stderr) => {
        if (err || stderr) reject(err || stderr)
        else resolve(stdout)
      })
    })
  }

  const logger = {
    info: function info () {
      const args = Object.keys(arguments).map(key => arguments[key]).join('\n  ')
      console.log('---------------------------------')
      console.log(' ', args)
      console.log('---------------------------------')
    },
    error: function error (err, code, moreinfo) {
      console.error(Chalk.red('\n--------------------------------------'))
      console.error(Chalk.red(' - Error Found! -'))
      console.error(Chalk.bold('  Message:'), err.message)
      console.error(Chalk.bold('  Details:'), ErrorDetail[code])
      if (process.env.DEBUG_VERBOSE === 'YAGG') {
        console.error(Chalk.bold('  moreinfo:'), JSON.stringify(moreinfo, null, 2))
        console.error(err)
      }
      console.error(Chalk.red(`----------- exit code ${code || 1} ------------`))
      process.exit(code)
    }
  }

  return {
    sanitize,
    parseWorkingDir,
    shell,
    logger,
    Errors,
    envInfo,
    transformContextIntoSedString,
  }
}
