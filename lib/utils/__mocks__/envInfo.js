const tmp = `${__dirname}/tmp`
module.exports = {
  SCRIPTS_DIR: require('path').resolve(__dirname, '../../'),
  CURRENT_DIR: tmp,
  CURRENT_DIR_NAME: tmp.split('/').pop()
}
