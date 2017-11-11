const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

function getUserHome () {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']
}

const adapter = new FileSync(path.join(getUserHome(), '.yagg'))
const db = low(adapter)

db.defaults({ generators: [] }).write()

exports.db = db

exports.generators = db.get('generators')
