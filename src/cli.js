import execa from 'execa'
import hasYarn from 'has-yarn'
import {prompt} from 'enquirer'
import colors from 'ansi-colors'
import writePkg from 'write-pkg'
import tools from './tools'
import printEffects from './core/print-effects'
import projectPackage from './utils/pkg'

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
    initial: false,
  })

  if (!confirmed) {
    return
  }

  const arguments_ = NPM_CLIENT === 'yarn' ? [] : ['install']
  await execa(NPM_CLIENT, arguments_).stdout.pipe(process.stdout)
}

async function run() {
  const selectedTools = await selectTools()

  if (selectedTools.length === 0) {
    console.log('nothing to install.')
    return false
  }

  const {files, dependencies, pkg} = printEffects(selectedTools)

  if (files.length !== 0 || dependencies.length !== 0 || pkg.length !== 0) {
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
  await writePkg(projectPackage)

  if (dependencies.length !== 0) {
    await installPackages()
  }

  return true
}

export default {run}
