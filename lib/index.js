
/**
 * Index
 */
module.exports = {
  cloneTemplateStructure,
}

/**
 *  
 */
const path = require('path')
const _utils = require('../utils')
const CURRENT_DIR = _utils.envInfo.CURRENT_DIR
const SCRIPTS_DIR = _utils.envInfo.SCRIPTS_DIR
const CURRENT_DIR_NAME = _utils.envInfo.CURRENT_DIR_NAME
const ErrorType = _utils.Errors.types
const logger = _utils.logger
const sanitize = _utils.sanitize
const parseWorkingDir = _utils.parseWorkingDir
const Shell = _utils.shell
global.console.reset = () => process.stdout.write('\033c')

function createDir(name) {
  if (!name) return Promise.reject(false);
  const fname = (name.substr(0, 1) === '/')? name.substr(1) : name

  return Shell(`mkdir ${CURRENT_DIR}/${fname}`)
  .then(() => console.log(` -> create dir: [ ✅  ] ${CURRENT_DIR_NAME}/${fname}`))
  .catch(err => {
    if (err.message.indexOf('File exists') !== -1)
      console.log(` -> create dir: [ 🔅  ] ${CURRENT_DIR_NAME}/${fname}`)
    else
      logger.error(err, ErrorType.CREATE_DIR)}
  )
}

function copyFile(filename, context) {
  if (!filename) return Promise.reject(false);
  
  const fname = (filename.substr(0, 1) === '/')? filename.substr(1) : filename
  const _path = '/app/'
  const _dist = '/'

  return Shell(`cp ${SCRIPTS_DIR}${_path}${fname} ${CURRENT_DIR}${_dist}${fname}`)
  .then(() => console.log(` ->  copy file: [ ✅  ] ${filename}`))
  .catch(err => logger.error(err, ErrorType.COPY_FILE))
}

function handleGeneralError(err) {
  return logger.error(err, ErrorType.GENERAL)
}

function cloneStructure(dirStructure, context) {
  return dirStructure.map(obj => {
    if (obj.isFolder) {
      createDir(obj.name)
      parseWorkingDir(obj.name).then(subdirStructure => {
        cloneStructure(subdirStructure, context)
      }).catch(handleGeneralError)
    } else {
      copyFile(obj.name, context)
    }
  })
}

function cloneTemplateStructure(context) {
  console.reset()
  logger.info(`Node version: ${process.version}`, `current: ${CURRENT_DIR}`)
  parseWorkingDir()
  .then(dirStructure => cloneStructure(dirStructure, context))
  .catch(handleGeneralError)
}

