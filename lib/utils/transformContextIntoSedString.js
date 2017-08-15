module.exports = function transformContextIntoSedString(context) {
  String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };

  if (!context || typeof context === 'string') return ''

  return Object.keys(context).map((key, index) => {
    const value = context[key].toString().replaceAll('\\.', '\\\\.')
    const pipe = (index === 0)? ' |' : ''
    return `${pipe} sed s.#{${key}}.${value}.g`
  }).join(' |')
}
