const Exec = require('child_process').exec

module.exports = function shell (cmd) {
  return new Promise((resolve, reject) => {
    Exec(cmd, (err, stdout, stderr) => {
      if (err || stderr) reject(err || stderr)
      else resolve(stdout)
    })
  })
}