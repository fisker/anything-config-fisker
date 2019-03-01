#!/usr/bin/env node

'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

require('write-pkg')
var execa = _interopDefault(require('execa'))
var hasYarn = _interopDefault(require('has-yarn'))
var inquirer = _interopDefault(require('inquirer'))
var chalk = _interopDefault(require('chalk'))
var fs = require('fs')
var path = require('path')
var readPkg = require('read-pkg')
require('cp-file')
require('latest-version')

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

var pkg = readPkg.sync({normalize: false})

const {hasOwnProperty} = Object.prototype

const {dependencies = {}, devDependencies = {}} = pkg

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
  const exists = hasProp(pkg, segments)
  const orignal = getValue(pkg, segments)

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

function hasEffects({files, dependencies, package: pkg}) {
  return files.length > 0 || dependencies.length > 0 || pkg.length > 0
}

function isExists({exists}) {
  return exists
}

function isInstalled({package: pkg, files, dependencies}) {
  return (
    pkg.some(isExists) || files.some(isExists) || dependencies.some(isExists)
  )
}

function install() {}

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

/* eslint-disable no-console */

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
  const pkgs = mergeEffectsByKey(tools, 'package')
    .filter(notEqualFilter)
    .sort(sortBy('key'))

  if (files.length !== 0) {
    console.log(
      chalk.yellowBright(
        `effect ${files.length} file${files.length > 1 ? 's' : ''}`
      )
    )
    for (const {sourceRelative, destRelative, exists} of files) {
      console.log(
        ` - ${destRelative}${exists ? chalk.red(' (overwrite)') : ''}`
      )
      // console.log(`    from ${chalk.gray(sourceRelative)}`)
    }
    console.log('')
  }

  if (dependencies.length !== 0) {
    console.log(
      chalk.yellowBright(
        `add ${dependencies.length} ${
          files.length > 1 ? 'dependencies' : 'dependency'
        } to package.json`
      )
    )
    for (const {name, version, type, exists} of dependencies) {
      console.log(` - ${name}${exists ? chalk.red(' (overwrite)') : ''}`)
    }
    console.log('')
  }

  if (pkgs.length !== 0) {
    console.log(
      chalk.yellowBright(
        `add ${pkgs.length} value${pkgs.length > 1 ? 's' : ''} to package.json`
      )
    )
    for (const {key, segments, orignal, value, exists, equal} of pkgs) {
      console.log(
        ` - ${segments.join('.')}${exists ? chalk.red(' (overwrite)') : ''}`
      )

      if (!equal) {
        if (orignal) {
          console.log(`    from: ${chalk.gray(JSON.stringify(orignal))}`)
          console.log(`      to: ${chalk.gray(JSON.stringify(orignal))}`)
        } else {
          console.log(`    ${chalk.gray(JSON.stringify(orignal))}`)
        }
      }
    }
    console.log('')
  }

  return {
    files,
    dependencies,
    package: pkgs,
  }
}

/* eslint-disable no-console */

const HAS_YARN = hasYarn()
const NPM_CLIENT = HAS_YARN ? 'yarn' : 'npm'

run()

// async function merge(tools) {
//   const files = tools.reduce((all, {files = []}) => [...all, ...files], [])

//   const dependencies = await parseDependencies(
//     tools
//       .reduce((all, {dependencies = []}) => all.concat(dependencies), [])
//       .filter(dependency => !isDependencyAdded(dependency))
//       .sort()
//   )

//   const json = tools.reduce(
//     (all, {package: pkg = {}}) => Object.assign(all, pkg),
//     {}
//   )

//   return {
//     files,
//     dependencies,
//     json,
//   }
// }

// async function setup(tools) {
//   const {files, dependencies, json} = await merge(tools)
//   const newDependencies = Object.keys(dependencies).length !== 0
//   const newFiles = files.length !== 0

//   await copyFiles(files)

//   pkg.devDependencies = Object.assign(dependencies, pkg.devDependencies)
//   Object.assign(pkg, json)

//   // eslint-disable-next-line no-underscore-dangle
//   delete pkg._id

//   await writePkg(pkg)

//   return {
//     newFiles,
//     newDependencies,
//   }
// }

async function selectTools() {
  const choices = tools.map(({id, name, isInstalled}, index, {length}) => {
    const maxIndexLength = String(length).length + 1

    const display = [
      chalk.gray(`${index + 1}.`.padStart(maxIndexLength)),
      isInstalled ? chalk.red('[installed]') : '',
      chalk.bold(name),
    ]
      .filter(Boolean)
      .join(' ')

    return {
      name: display,
      value: id,
      short: name,
    }
  })

  const {selectedIds} = await inquirer.prompt({
    type: 'checkbox',
    name: 'selectedIds',
    message: 'select config(s) you want install:',
    choices,
    pageSize: Math.min(choices.length, 15),
  })

  if (selectedIds.length === 0) {
    const selected = await selectTools()
    return selected
  }

  const selected = tools.filter(({id}) => selectedIds.includes(id))
  const names = selected.map(({name}) => name)

  const {confirmed} = await inquirer.prompt({
    type: 'confirm',
    name: 'confirmed',
    message: `install ${selected.length} selected config(s): ${names.join(
      ','
    )}?`,
    default: true,
  })

  if (!confirmed) {
    const selected = await selectTools()
    return selected
  }

  return selected
}

async function installPackages() {
  const {confirmed} = await inquirer.prompt({
    type: 'confirm',
    name: 'confirmed',
    message: `run ${NPM_CLIENT} to install?`,
    default: true,
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

  const {files, dependencies, package: pkgs} = printEffects(selectedTools)

  if (files.length !== 0 || dependencies.length !== 0 || pkgs.length !== 0) {
    const {confirmed} = await inquirer.prompt({
      type: 'confirm',
      name: 'confirmed',
      message: `confirmed effects above?`,
      default: true,
    })

    if (!confirmed) {
      return false
    }
  }

  await Promise.all(selectedTools.map(tool => tool.install(tool)))

  if (dependencies.length !== 0) {
    await installPackages()
  }
}

var cli = {run}

module.exports = cli
