const repo = 'g3org3-generator'

describe('envInfo', () => {
  it('check env info', () => {
    const envInfo = require('../envInfo')
    expect(envInfo.SCRIPTS_DIR.split('/').pop()).toBe(repo)
    expect(envInfo.CURRENT_DIR_NAME).toBe(repo)
    expect(envInfo.SCRIPTS_DIR).toBe(envInfo.CURRENT_DIR)
  })
})