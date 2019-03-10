'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var execa = _interopDefault(require('execa'))
var hasYarn = _interopDefault(require('has-yarn'))
var enquirer = require('enquirer')
var colors = _interopDefault(require('ansi-colors'))
var fs = require('fs')
var path = require('path')
var readPkg = require('read-pkg')
var cpFile = _interopDefault(require('cp-file'))
var latestVersion = _interopDefault(require('latest-version'))
var writePkg = _interopDefault(require('write-pkg'))

const TOOLS_DIR = path.join(__dirname, '../tools/')
const CWD = process.cwd()

function isInDir(dir, file) {
  return path.normalize(file).startsWith(path.normalize(dir))
}

function fileParser(file, dir) {
  if (typeof file === 'string') {
    file = {source: file}
  }

  let {source, dest = source} = file

  source = path.join(dir, source)
  if (!isInDir(dir, source) || !fs.existsSync(source)) {
    return null
  }

  dest = path.join(CWD, dest)

  if (!isInDir(CWD, dest)) {
    return null
  }

  const exists = fs.existsSync(dest)

  return {
    file: path.relative(dir, source),
    source,
    sourceRelative: path.relative(dir, source),
    dest,
    destRelative: path.relative(CWD, dest),
    exists,
  }
}

var projectPackage = readPkg.sync({normalize: false})

const {hasOwnProperty} = Object.prototype

const {dependencies = {}, devDependencies = {}} = projectPackage

const pkgDependencies = {
  any: {
    ...dependencies,
    ...devDependencies,
  },
  dependencies,
  devDependencies,
}

function isDependencyListed(dependency, type) {
  return hasOwnProperty.call(pkgDependencies[type || 'any'], dependency)
}

function dependencyParser(dependency) {
  if (typeof dependency === 'string') {
    dependency = {name: dependency}
  }

  const {name, version = null, type = null} = dependency

  const exists = isDependencyListed(name, type)

  return {
    name,
    version,
    type,
    exists,
  }
}

function isUndefined(x) {
  return typeof x === 'undefined'
}

function getPathSegments(keys) {
  if (Array.isArray(keys)) {
    return keys
  }
  const re = /(?:\[(['"`]?)(.*?)\1\])|(?:(?:^|\.)([^.]+?)(?=$|\.|\[))/g

  const parts = []

  let res
  while ((res = re.exec(keys))) {
    let prop = res[2]
    if (isUndefined(prop)) {
      prop = res[3]
    }
    parts.push(prop)
  }

  return parts
}

function isNull(x) {
  return x === null
}

function isObject(x) {
  const type = typeof x
  return !isNull(x) && (type === 'object' || type === 'function')
}

function hasProp(obj, path) {
  if (!isObject(obj)) {
    return false
  }

  const seg = getPathSegments(path)
  const {length} = seg

  for (let i = 0; i < length; i += 1) {
    if (!isObject(obj)) {
      return false
    }

    const prop = seg[i]
    if (!(prop in obj)) {
      return false
    }

    obj = obj[prop]
  }

  return true
}

function getValue(obj, path) {
  if (!isObject(obj)) {
    return null
  }

  const seg = getPathSegments(path)
  const {length} = seg

  for (let i = 0; i < length; i += 1) {
    const prop = seg[i]

    if (i === length - 1) {
      return obj[prop]
    }

    if (!isObject(obj[prop])) {
      return null
    }

    obj = obj[prop]
  }

  return obj
}

function packageParser({key, value}) {
  const segments = getPathSegments(key)
  const exists = hasProp(projectPackage, segments)
  const orignal = getValue(projectPackage, segments)

  key = segments.map(seg => `[${JSON.stringify(seg)}]`).join('')

  const equal = JSON.stringify(orignal) === JSON.stringify(value)

  return {
    key,
    segments,
    value,
    exists,
    orignal,
    equal,
  }
}

function toArray(x) {
  return Array.isArray(x) ? x : [x]
}

function effectsParser(effects, dir) {
  let {files = [], dependencies = [], 'package.json': pkg = []} = effects

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
    pkg,
  }
}

function hasEffects({files, dependencies, pkg}) {
  return files.length > 0 || dependencies.length > 0 || pkg.length > 0
}

function isExists({exists}) {
  return exists
}

function isInstalled({pkg, files, dependencies}) {
  return (
    pkg.some(isExists) || files.some(isExists) || dependencies.some(isExists)
  )
}

async function copyFiles(files) {
  await Promise.all(files.map(({source, dest}) => cpFile(source, dest)))
}

function setValue(obj, path, value) {
  if (!isObject(obj)) {
    return obj
  }

  const seg = getPathSegments(path)
  const {length} = seg
  const root = obj

  for (let i = 0; i < length; i += 1) {
    const prop = seg[i]
    if (!isObject(obj[prop])) {
      obj[prop] = {}
    }

    if (i === length - 1) {
      obj[prop] = value
    }

    obj = obj[prop]
  }

  return root
}

function updatePackage(pkg, {key, value}) {
  return setValue(pkg, key, value)
}

function writePackage(pkg) {
  return writePkg.sync(pkg.reduce(updatePackage, projectPackage))
}

async function writeDependency({type, name}) {
  const key = [type || 'devDependency', name]
  const version = await latestVersion(name)
  const value = version ? `^${version}` : 'latest'

  return writePackage([
    {
      key,
      value,
    },
  ])
}

function writeDependencies(dependencies) {
  return dependencies.filter(isExists).map(writeDependency)
}

function install({effects}) {
  const {files, dependencies, pkg} = effects

  return Promise.all([
    copyFiles(files),
    writeDependencies(dependencies),
    writePackage(pkg),
  ])
}

const helpers = {
  exists: isExists,
}

function getToolConfig(dirName) {
  const dir = path.join(TOOLS_DIR, dirName)
  const config = require(dir)

  const {name = dirName, install: install$1 = install} = config

  const effects = effectsParser(config.effects, dir)

  const isInstalled$1 = (config.isInstalled || isInstalled)(effects, helpers)
  const hasEffects$1 = hasEffects(effects)

  return {
    id: dir,
    name,
    dirName,
    dir,
    effects,
    isInstalled: isInstalled$1,
    install: install$1,
    hasEffects: hasEffects$1,
  }
}

const dirs = fs.readdirSync(TOOLS_DIR).sort()
const tools = dirs.map(getToolConfig)

function mergeEffectsByKey(tools, key) {
  return tools.reduce((all, {effects}) => all.concat(effects[key]), [])
}

function sortBy(key) {
  return (l, r) => (l[key] > r[key] ? 1 : -1)
}

function notEqualFilter({equal}) {
  return !equal
}

function printEffects(tools) {
  const files = mergeEffectsByKey(tools, 'files').sort(sortBy('dest'))
  const dependencies = mergeEffectsByKey(tools, 'dependencies').sort(
    sortBy('name')
  )
  const pkg = mergeEffectsByKey(tools, 'pkg')
    .filter(notEqualFilter)
    .sort(sortBy('key'))

  if (files.length !== 0) {
    console.log(
      colors.yellowBright(`${files.length} file${files.length > 1 ? 's' : ''}`)
    )
    for (const {sourceRelative, destRelative, exists} of files) {
      console.log(
        ` - ${destRelative}${exists ? colors.red(' (overwrite)') : ''}`
      )
      // console.log(`    from ${colors.gray(sourceRelative)}`)
    }
    console.log('')
  }

  if (dependencies.length !== 0) {
    console.log(
      colors.yellowBright(
        `${dependencies.length} ${
          files.length > 1 ? 'dependencies' : 'dependency'
        } add to package.json`
      )
    )
    for (const {name, version, type, exists} of dependencies) {
      console.log(` - ${name}${exists ? colors.red(' (overwrite)') : ''}`)
    }
    console.log('')
  }

  if (pkg.length !== 0) {
    console.log(
      colors.yellowBright(
        `${pkg.length} change${pkg.length > 1 ? 's' : ''} in package.json`
      )
    )
    for (const {key, segments, orignal, value, exists, equal} of pkg) {
      console.log(
        ` - ${segments.join('.')}${exists ? colors.red(' (overwrite)') : ''}`
      )

      if (!equal) {
        if (orignal) {
          console.log(`    from: ${colors.gray(JSON.stringify(orignal))}`)
          console.log(`      to: ${colors.gray(JSON.stringify(orignal))}`)
        } else {
          console.log(`    ${colors.gray(JSON.stringify(orignal))}`)
        }
      }
    }
    console.log('')
  }

  return {
    files,
    dependencies,
    pkg,
  }
}

const HAS_YARN = hasYarn()
const NPM_CLIENT = HAS_YARN ? 'yarn' : 'npm'

run()

async function selectTools() {
  const choices = tools.map(({id, name, isInstalled}, index, {length}) => {
    const maxIndexLength = String(length).length + 1

    const message = [
      colors.gray(`${index + 1}.`.padStart(maxIndexLength)),
      isInstalled ? colors.red('[installed]') : '',
      colors.bold(name),
    ]
      .filter(Boolean)
      .join(' ')

    return {
      name,
      value: id,
      message,
    }
  })

  const {selectedIds} = await enquirer.prompt({
    type: 'multiselect',
    name: 'selectedIds',
    message: 'select config(s) you want install:',
    choices,
    pageSize: Math.min(choices.length, 15),
  })

  if (selectedIds.length === 0) {
    const selected = await selectTools()
    return selected
  }

  // FIXME: currently enquirer returns names instead of values
  // issue: https://github.com/enquirer/enquirer/issues/121
  const selected = tools.filter(({name}) => selectedIds.includes(name))
  // const selected = tools.filter(({id}) => selectedIds.includes(id))
  const names = selected.map(({name}) => name)

  const {confirmed} = await enquirer.prompt({
    type: 'confirm',
    name: 'confirmed',
    message: `install ${selected.length} selected config(s): ${names.join(
      ','
    )}?`,
    initial: true,
  })

  if (!confirmed) {
    const selected = await selectTools()
    return selected
  }

  return selected
}

async function installPackages() {
  const {confirmed} = await enquirer.prompt({
    type: 'confirm',
    name: 'confirmed',
    message: `run ${NPM_CLIENT} to install?`,
    initial: true,
  })

  if (!confirmed) {
    return
  }

  const args = NPM_CLIENT === 'yarn' ? [] : ['install']
  await execa(NPM_CLIENT, args).stdout.pipe(process.stdout)
}

async function run() {
  const selectedTools = await selectTools()

  if (selectedTools.length === 0) {
    console.log('nothing to install.')
    return false
  }

  const {files, dependencies, pkg} = printEffects(selectedTools)

  if (files.length !== 0 || dependencies.length !== 0 || pkg.length !== 0) {
    const {confirmed} = await enquirer.prompt({
      type: 'confirm',
      name: 'confirmed',
      message: `confirmed effects above?`,
      initial: true,
    })

    if (!confirmed) {
      return false
    }
  }

  await Promise.all(selectedTools.map(tool => tool.install(tool)))

  if (dependencies.length !== 0) {
    await installPackages()
  }

  return true
}

var cli = {run}

module.exports = cli
