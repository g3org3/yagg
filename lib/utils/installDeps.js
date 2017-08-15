// const shell = require('./shell')
// const logger = require('./logger')
const execSync = require('child_process').execSync
const spawn = require('child_process').spawn
// const isTest = process.env.NODE_ENV === 'test'

module.exports = function installDeps (list, options) {
  if (!list || !(list instanceof Array) || list.length === 0) {
    return '(which yarn && yarn) || npm install'
  }

  const useYarn = isYarnAvailable()

  if (useYarn) {
    spawn('yarn', ['add'].concat(list), { stdio: 'inherit' })
  } else {
    spawn('npm', ['install', '--save'].concat(list), { stdio: 'inherit' })
  }
}

function isYarnAvailable () {
  try {
    execSync('yarn --version')
    return true
  } catch (e) {
    return false
  }
}
