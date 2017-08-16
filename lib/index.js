/**
 * Dependencies
 */
const path = require('path')
const pkg = require('../package.json')
const utils = require('./utils')

/**
 * Constants
 */
const CURRENT_DIR = process.env.PWD
const CURRENT_DIR_NAME = process.env.PWD.split('/').pop()
const ErrorType = utils.errors.types

/**
 * Utils
 */
const sanitize = utils.sanitize
const execPromise = utils.execPromise
const logger = utils.logger
const installDependencies = utils.installDependencies
const transformContextIntoSedString = utils.transformContextIntoSedString

/**
 * MAIN
 */
module.exports = function setup (_dirname) {
  const SCRIPTS_DIR = _dirname

  function parseWorkingDir (dir) {
    const _subdir = sanitize(dir) + '/'
    const _path = `${SCRIPTS_DIR}/app/${_subdir}`

    return execPromise(`ls -lA ${_path}`).then(rawOutput => {
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
      return filesAndDirs
    })
      .catch(err => logger.error(err, ErrorType.LIST_DIR))
  }

  function createDir (name) {
    if (!name) return Promise.reject(new Error('`name` is undefined'))
    const fname = (name.substr(0, 1) === '/') ? name.substr(1) : name

    return execPromise(`mkdir ${CURRENT_DIR}/${fname}`)
      .then(() => console.log(` -> create dir: [ ✅  ] ${CURRENT_DIR_NAME}/${fname}`))
      .catch(err => {
        if (err.message.indexOf('File exists') !== -1) { console.log(` -> create dir: [ 🔅  ] ${CURRENT_DIR_NAME}/${fname}`) } else { logger.error(err, ErrorType.CREATE_DIR) }
      }
      )
  }

  function copyFile (filename, context) {
    if (!filename) return Promise.reject(new Error('`filename` is undefined'))

    const fname = (filename.substr(0, 1) === '/') ? filename.substr(1) : filename
    const _path = '/app/'
    const _dist = '/'
    const extension = path.extname(filename)
    const isImage = extension === '.jpg' ||
      extension === '.png' ||
      extension === '.jpeg' ||
      extension === '.gif' ||
      extension === '.ico'
    const replaceWithContext = (isImage) ? '' : transformContextIntoSedString(context)

    return execPromise(`cat ${SCRIPTS_DIR}${_path}${fname} ${replaceWithContext} > ${CURRENT_DIR}${_dist}${fname}`)
      .then(() => console.log(` ->  copy file: [ ✅  ] ${filename}`))
      .catch(err => {
        if (process.env.YAGG_SKIP === 'true') {
          console.log(` ->  copy file: [ ❌  ] ${filename}`)
          return
        }
        logger.error(err, ErrorType.COPY_FILE, {
          command: `cat ${SCRIPTS_DIR}${_path}${fname} ${replaceWithContext} > ${CURRENT_DIR}${_dist}${fname}`,
          sedString: replaceWithContext
        })
      })
  }

  function handleGeneralError (err) {
    return logger.error(err, ErrorType.GENERAL)
  }

  function cloneStructure (dirStructure, context) {
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

  function cloneTemplateStructure (context) {
    logger.success()
    logger.info(
      `Node version: ${process.version}`,
      `yagg version: ${pkg.version}`,
      `current: ${CURRENT_DIR}`
    )
    parseWorkingDir()
      .then(dirStructure => cloneStructure(dirStructure, context))
      .catch(handleGeneralError)
  }

  return {
    cloneTemplateStructure,
    installDependencies
  }
}
