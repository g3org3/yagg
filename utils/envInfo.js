
module.exports = (_dirname) => ({
  SCRIPTS_DIR: _dirname || require('path').resolve(__dirname, '../'),
  CURRENT_DIR: process.env.PWD,
  CURRENT_DIR_NAME: process.env.PWD.split('/').pop(),
})