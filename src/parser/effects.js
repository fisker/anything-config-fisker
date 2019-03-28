import fileParser from './file'
import dependencyParser from './dependency'
import packageParser from './package'

function toArray(x) {
  return Array.isArray(x) ? x : [x]
}

function packageToArray(package_) {
  return Array.isArray(package_)
    ? package_
    : Object.keys(package_).reduce(
        (all, key) => [
          ...all,
          {
            key,
            value: package_[key],
          },
        ],
        []
      )
}

function effectsParser(effects, directory) {
  let {files = [], dependencies = [], 'package.json': package_ = []} = effects

  files = toArray(files)
    .map(file => fileParser(file, directory))
    .filter(Boolean)
  dependencies = toArray(dependencies)
    .map(dependencyParser)
    .filter(Boolean)
  package_ = packageToArray(package_)
    .map(packageParser)
    .filter(Boolean)

  return {
    files,
    dependencies,
    pkg: package_,
  }
}

export default effectsParser
