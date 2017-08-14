const shell = require('./shell')
const isTest = process.env.NODE_ENV === 'test'
const logger = require('./index')().logger

module.exports = function installDeps (list, options) {
  if (!list || !(list instanceof Array) || list.length === 0) {
    return '(which yarn && yarn) || npm install'
  }
  
  const deps = list.join(' ')
  const command = `(which yarn && yarn add ${deps}) || npm install --save ${deps}`
  if (isTest) {
    return command;
  }
  shell(command).then(console.log).catch(err => logger.error(err, 1, { command }))
}