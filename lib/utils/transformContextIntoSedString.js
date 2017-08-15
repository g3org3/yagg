module.exports = function transformContextIntoSedString (context) {
  if (!context || typeof context === 'string') return ''

  return Object.keys(context).map((key, index) => {
    const value = replaceAll(context[key].toString(), '\\.', '\\\\.')
    const pipe = (index === 0) ? ' |' : ''
    return `${pipe} sed s.#{${key}}.${value}.g`
  }).join(' |')
}

function replaceAll (search, replacement) {
  var target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}
