import fileParser from './file'
import dependencyParser from './dependency'
import packageParser from './package'

function toArray(x) {
  return Array.isArray(x) ? x : [x]
}

function effectsParser(effects, dir) {
  let {files = [], dependencies = [], package: pkg = []} = effects

  files = toArray(files)
    .map(file => fileParser(file, dir))
    .filter(Boolean)
  dependencies = toArray(dependencies)
    .map(dependencyParser)
    .filter(Boolean)
  pkg = toArray(pkg)
    .map(packageParser)
    .filter(Boolean)

  return {
    files,
    dependencies,
    package: pkg,
  }
}

export default effectsParser
