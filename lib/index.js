Object.defineProperty(exports, '__esModule', {value: true})

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex.default : ex
}

const fs = require('fs')
const path = require('path')
const cpFile = _interopDefault(require('cp-file'))
const readPkg = require('read-pkg')
const writePkg = _interopDefault(require('write-pkg'))
const latestVersion = _interopDefault(require('latest-version'))

// import execa from 'execa'
// import hasYarn from 'has-yarn'

const hasOwn = Object.prototype.hasOwnProperty
const TOOLS_DIR = path.join(__dirname, '../tools/')
const CWD = process.cwd()
const pkg = readPkg.sync()
// const npmClient = hasYarn() ? 'yarn' : 'npm'

install()

function loadToolConfig(name) {
  return {
    name,
    ...require(path.join(TOOLS_DIR, name)),
  }
}

function uniqArr(arr) {
  return [...new Set(arr)]
}

function getTools() {
  const dirs = fs.readdirSync(TOOLS_DIR)

  return dirs.map(loadToolConfig)
}

async function getDependenciesVersion(dependencies) {
  dependencies = uniqArr(dependencies)

  const versions = await Promise.all(
    dependencies.map(dependency => latestVersion(dependency))
  )

  return dependencies.reduce(
    (all, dependency, index) =>
      Object.assign(all, {[dependency]: `^${versions[index]}`}),
    {}
  )
}

async function merge(tools) {
  const files = tools.reduce(
    (all, {name, files = []}) =>
      all.concat(
        files.map(file => ({
          source: path.join(TOOLS_DIR, name, file),
          target: path.join(CWD, file),
        }))
      ),
    []
  )

  const dependencies = await getDependenciesVersion(
    tools
      .reduce((all, {dependencies = []}) => all.concat(dependencies), [])
      .filter(
        dependency =>
          !hasOwn.call(pkg.devDependencies, dependency) &&
          !hasOwn.call(pkg.devDependencies, dependency)
      )
      .sort()
  )

  const json = tools.reduce(
    (all, {package: pkg = {}}) => Object.assign(all, pkg),
    {}
  )

  return {
    files,
    dependencies,
    json,
  }
}

async function copyConfigFiles(files) {
  await Promise.all(files.map(({source, target}) => cpFile(source, target)))
}

async function install() {
  const tools = getTools()

  const {files, dependencies, json} = await merge(tools)

  await copyConfigFiles(files)

  pkg.devDependencies = Object.assign(dependencies, pkg.devDependencies)
  Object.assign(pkg, json)

  // eslint-disable-next-line no-underscore-dangle
  delete pkg._id

  await writePkg(pkg)
}

exports.install = install
