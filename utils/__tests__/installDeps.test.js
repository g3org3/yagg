const installDeps = require('../installDeps')

describe('installDeps', () => {
  it('install a list of dependencies', () => {
    const result = installDeps()
    expect(result).toBe('')
  })
})