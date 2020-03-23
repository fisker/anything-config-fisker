import fileParser from './file'
import dependencyParser from './dependency'
import packageParser from './package'

function toArray(x) {
  return Array.isArray(x) ? x : [x]
}

function packageToArray(packageJson) {
  return Array.isArray(packageJson)
    ? packageJson
    : Object.keys(packageJson).reduce(
        (all, key) => [
          ...all,
          {
            key,
            value: packageJson[key],
          },
        ],
        []
      )
}

function effectsParser(effects, directory) {
  let {files = [], dependencies = [], packageJson = []} = effects

  files = toArray(files)
    .map((file) => fileParser(file, directory))
    .filter(Boolean)
  dependencies = toArray(dependencies).map(dependencyParser).filter(Boolean)
  packageJson = packageToArray(packageJson).map(packageParser).filter(Boolean)

  return {
    files,
    dependencies,
    packageJson,
  }
}

export default effectsParser
