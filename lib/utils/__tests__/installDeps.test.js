const installDeps = require('../installDeps')

describe('installDeps', () => {
  it('install a list of dependencies | undefined', () => {
    const result = installDeps()
    expect(result).toBe('(which yarn && yarn) || npm install')
  })

  it('install a list of dependencies | []', () => {
    const result = installDeps([])
    expect(result).toBe('(which yarn && yarn) || npm install')
  })

  it('install a list of dependencies | [react]', () => {
    const result = installDeps(['react-redux'])
    expect(result).toBe('(which yarn && yarn add react-redux) || npm install --save react-redux')
  })

  it('install a list of dependencies | [one, two]', () => {
    const result = installDeps(['react-redux', 'react-router-dom'])
    expect(result).toBe('(which yarn && yarn add react-redux react-router-dom) || npm install --save react-redux react-router-dom')
  })

  it('install a list of dependencies | object', () => {
    const result = installDeps({ name: 'a' })
    expect(result).toBe('(which yarn && yarn) || npm install')
  })
})
