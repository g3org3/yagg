const Joi = require('joi')
const path = require('path')

const pathJoi = Joi.extend(joi => ({
  base: joi.string(),
  name: 'path',
  language: {
    isAbsolute: 'needs to be an absolute path'
  },
  rules: [
    {
      name: 'isAbsolute',
      validate (params, value, state, options) {
        if (path.isAbsolute(value)) {
          return value
        }
        return this.createError('path.isAbsolute', { v: value }, state, options)
      }
    }
  ]
}))

const generatorSchema = Joi.object().keys({
  __dirname: pathJoi.path().isAbsolute()
})

exports.generatorConfig = config => Joi.validate(config, generatorSchema)
