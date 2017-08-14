
const model = {}

model.shell = require('./shell')
model.errors= require('./errors')
model.logger = require('./logger')
model.getDeps = require('./getDeps')
model.sanitize = require('./sanitize')
model.installDeps  = require('./installDeps')
model.transformContextIntoSedString = require('./transformContextIntoSedString')

module.exports = model