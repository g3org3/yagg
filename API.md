# Api

## cloneTemplateStructure

### Description
This method allows you to clone the entire template into the desire directory

### Params
none

### Example
```javascript
const yagg = require('yagg')
yagg.cloneTemplateStructure()
```


## installDependencies

### Description
This method allows you to clone the entire template into the desire directory

### Params
| Type  |          | Name         | Description
| ----  | -------- | ------------ | -----------
| Array | *optional* | dependencies | An array of strings with the name of the dependencies to install and save to package.json

### Examples
#### With dependecies
```javascript
const yagg = require('yagg')
const dependencies = [
  'react',
  'react-redux'
]
yagg.installDependencies(dependencies)

// will do npm install --save react react-redux
// or if yarn is available
// yarn add react react-redux
```
#### Without params
```javascript
const yagg = require('yagg')
yagg.installDependencies()

// will do npm install 
// or if yarn is available
// yarn
```
