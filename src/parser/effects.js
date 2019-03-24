import fileParser from './file'
import dependencyParser from './dependency'
import packageParser from './package'

function toArray(x) {
  return Array.isArray(x) ? x : [x]
}

function pkgToArray(pkg) {
  return Array.isArray(pkg)
    ? pkg
    : Object.keys(pkg).reduce(
        (all, key) => [
          ...all,
          {
            key,
            value: pkg[key],
          },
        ],
        []
      )
}

function effectsParser(effects, dir) {
  let {files = [], dependencies = [], 'package.json': pkg = []} = effects

  files = toArray(files)
    .map(file => fileParser(file, dir))
    .filter(Boolean)
  dependencies = toArray(dependencies)
    .map(dependencyParser)
    .filter(Boolean)
  pkg = pkgToArray(pkg)
    .map(packageParser)
    .filter(Boolean)

  return {
    files,
    dependencies,
    pkg,
  }
}

export default effectsParser
