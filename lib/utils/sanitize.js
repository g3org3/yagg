
module.exports = function sanitize(name) {
  if (!name) return ''
  
  let _name = name
  const firstChar = _name.substr(0, 1)
  const lastChar = _name.substr(_name.length - 1)
  
  // remove first slash
  _name = (firstChar === '/') ? name.substr(1) : name
  // remove last slash
  _name = (lastChar === '/') ? _name.substr(0, _name.length - 1) : _name
  
  return _name
}