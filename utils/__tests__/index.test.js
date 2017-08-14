const utils = require('../')
const sanitize = utils.sanitize

test('sanitize', () => {
  it('remove slashes | name', () => {
    const result = sanitize('name')
    expect(result).toBe('name')
  })
  it('remove slashes | /name', () => {
    const result = sanitize('/name')
    expect(result).toBe('name')
  })
  it('remove slashes | /name/', () => {
    const result = sanitize('/name/')
    expect(result).toBe('name')
  })
  it('remove slashes | undefined', () => {
    const result = sanitize()
    expect(result).toBe('')
  })
})