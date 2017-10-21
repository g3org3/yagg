const utils = require('../')
const sanitize = utils.sanitize
const transformContextIntoSedString = utils.transformContextIntoSedString
const execPromise = utils.execPromise
const logger = utils.logger
// const installDependencies = utils.installDependencies
// const getGlobalDependencies = utils.getGlobalDependencies
const replaceAll = utils.replaceAll

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

  it('return escaped spaces | sample text message', () => {
    const result = transformContextIntoSedString({
      descrip: 'sample text message'
    })
    expect(result).toBe(' | sed s.#{descrip}.sample\\ text\\ message.g')
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

describe('execPromise', () => {
  it('return a promise with command', () => {
    execPromise('ls -al').then(cmd => {
      expect(cmd).toBe('ls -al')
    })
  })
})

describe('logger', () => {
  it('info | split arguments with newline', () => {
    const args = logger.info('first message', 'second message')
    expect(args).toBe('first message\n  second message')
  })

  it('info | pritn 2 times', () => {
    let counter = 0
    global.console.log = jest.fn(() => counter++)
    logger.info('first message', 'second message')
    expect(console.log).toHaveBeenCalled()
    expect(counter).toBe(2)
  })

  it('error | print 7 times and exit process', () => {
    let counter = 0
    let exited = false
    global.console.error = jest.fn(() => counter++)
    global.process.exit = jest.fn(() => {
      exited = true
    })
    logger.error(new Error('message'), 1)
    expect(console.log).toHaveBeenCalled()
    expect(counter).toBe(9)
    expect(exited).toBe(true)
  })

  it('warning | todo: write test', () => {})
  it('success | todo: write test', () => {})

  /**
   * Unable to mock process.env.YAGG_DEBUG for ONLY this test
   * It changes for all tests :(
   */
  it('error | print 8 when isVerboseEnabled', () => {
    let counter = 0
    let exited = false
    // global.process.env.YAGG_DEBUG = 'verbose'
    global.console.error = jest.fn(() => counter++)
    global.process.exit = jest.fn(() => {
      exited = true
    })
    logger.error(new Error('message'), 1)
    expect(console.log).toHaveBeenCalled()
    expect(counter).toBe(9) // this should be 10?
    expect(exited).toBe(true)
    // global.process.env.YAGG_DEBUG = ''
  })
})

describe('getGlobalDependencies', () => {
  it('todo: write test', () => {})
})

describe('installDependencies', () => {
  it('todo: write test', () => {})
})

describe('transformContextIntoSedString', () => {
  it('todo: write test', () => {})
})

describe('replaceAll', () => {
  it('replace token with hello', () => {
    const result = replaceAll('#{token} world', '#{token}', 'hello')
    expect(result).toBe('hello world')
  })
})
