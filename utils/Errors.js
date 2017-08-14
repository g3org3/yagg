
module.exports = {
  types: {
    GENERAL: 1,
    LIST_DIR: 100,
    COPY_FILE: 200,
    CREATE_DIR: 300,
  },
  details: {
    1: 'General Error :(',
    100: 'Could not list directory',
    200: 'Could not copy file',
    300: 'Could not create directory'
  }
}