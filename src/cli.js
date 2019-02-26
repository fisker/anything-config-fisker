/* eslint-disable no-console */

import {join} from 'path'
import writePkg from 'write-pkg'
import execa from 'execa'
import hasYarn from 'has-yarn'
import inquirer from 'inquirer'
import isDependencyAdded from './utils/is-dependency-added'
import tools from './utils/tools'
import pkg from './utils/pkg'
import copyFiles from './utils/copy-files'
import parseDependencies from './utils/parse-dependencies'
import {TOOLS_DIR, CWD} from './constants'

const HAS_YARN = hasYarn()
const NPM_CLIENT = HAS_YARN ? 'yarn' : 'npm'

run()

async function merge(tools) {
  const files = tools.reduce((all, {files = []}) => [...all, ...files], [])

  const dependencies = await parseDependencies(
    tools
      .reduce((all, {dependencies = []}) => all.concat(dependencies), [])
      .filter(dependency => !isDependencyAdded(dependency))
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

async function setup(tools) {
  const {files, dependencies, json} = await merge(tools)

  await copyFiles(files)

  pkg.devDependencies = Object.assign(dependencies, pkg.devDependencies)
  Object.assign(pkg, json)

  // eslint-disable-next-line no-underscore-dangle
  delete pkg._id

  await writePkg(pkg)
}

async function selectTools() {
  const choices = tools.map(({name, install, installed}, index) => {
    const checked = install && !installed
    let display = `${index + 1}. ${name}`

    if (installed) {
      display = `${index + 1}. [installed] ${name}`
    } else if (!install) {
      display = `${index + 1}. * not install by default * ${name}`
    }

    return {
      name: display,
      value: name,
      short: name,
      checked,
    }
  })

  const {selected} = await inquirer.prompt({
    type: 'checkbox',
    name: 'selected',
    choices,
  })

  if (selected.length === 0) {
    return []
  }

  const {confirmed} = await inquirer.prompt({
    type: 'confirm',
    name: 'confirmed',
    message: `install ${selected.length} selected config(s): ${selected.join(
      ','
    )}?`,
    default: true,
  })

  if (!confirmed) {
    const selected = await selectTools()
    return selected
  }

  return tools.filter(({name}) => selected.includes(name))
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
  const {stdout} = await execa(NPM_CLIENT, args)

  console.log(stdout)
}

async function run() {
  const selectedTools = await selectTools()

  if (selectedTools.length === 0) {
    console.log('nothing to install.')
    return
  }

  await setup(selectedTools)

  await installPackages()
}

export default {run}
