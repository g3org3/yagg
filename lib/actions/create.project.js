const path = require('path')
const { logger, errors } = require('../utils')
const yagg = require('../')

const ErrorType = errors.types

function action (template, pwd, projectName) {
  try {
    const config = require(template)
    yagg.setup(Object.assign(config, { pwd, projectName })).run()
  } catch (err) {
    logger.error(err, ErrorType.GENERAL, { template })
  }
}

function command (program) {
  program
    .command('new <template>')
    .description('create a new project from a template')
    .option('-p, --path', 'use a path to search the template')
    .option('-n, --name <projectName>', 'name of your new project')
    .action((template, { path: isPath, name: projectName }) => {
      const pwd = process.cwd()
      projectName = typeof projectName === 'function' ? null : projectName
      if (!isPath) {
        template = `yagg-${template}`
      } else if (!path.isAbsolute(template)) {
        template = path.resolve(pwd, template)
      }

      action(template, pwd, projectName)
    })
}

module.exports = {
  command,
  action
}
