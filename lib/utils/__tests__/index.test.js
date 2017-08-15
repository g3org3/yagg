const utils = require('../')
const sanitize = utils.sanitize
const transformContextIntoSedString = utils.transformContextIntoSedString

describe('sanitize', () => {
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

describe('transformContextIntoSedString', () => {
  it('convert object into sed string', () => {
    const result = transformContextIntoSedString({ name: 'test', port: 8080 })
    expect(result).toBe(' | sed s.#{name}.test.g | sed s.#{port}.8080.g')
  })
  it('convert object into sed string | escape dots', () => {
    const result = transformContextIntoSedString({ host: '127.0.0.1' })
    expect(result).toBe(' | sed s.#{host}.127\\\\.0\\\\.0\\\\.1.g')
  })

  it('return empty strings | {}', () => {
    const result = transformContextIntoSedString({})
    expect(result).toBe('')
  })

  it('return empty strings | undefined', () => {
    const result = transformContextIntoSedString()
    expect(result).toBe('')
  })

  it('return empty strings | wrong input', () => {
    const result = transformContextIntoSedString('wrong')
    expect(result).toBe('')
  })
})
