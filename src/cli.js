/* eslint-disable no-console */

import writePkg from 'write-pkg'
import execa from 'execa'
import hasYarn from 'has-yarn'
import {prompt} from 'enquirer'
import colors from 'ansi-colors'
// import isDependencyAdded from './utils/is-dependency-added'
import tools from './tools'
import pkg from './utils/pkg'
import copyFiles from './utils/copy-files'
import parseDependencies from './utils/parse-dependencies'
import printEffects from './core/print-effects'

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

  const {selectedIds} = await prompt({
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

  const {confirmed} = await prompt({
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
  const {confirmed} = await prompt({
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

  const {files, dependencies, package: pkgs} = printEffects(selectedTools)

  if (files.length !== 0 || dependencies.length !== 0 || pkgs.length !== 0) {
    const {confirmed} = await prompt({
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
}

export default {run}
