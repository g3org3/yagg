// Dependencies
const Chalk = require('chalk')
const ErrorDetail = require('./errors').details

module.exports = {
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