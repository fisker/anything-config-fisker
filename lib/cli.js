import process from 'node:process'
import {execa} from 'execa'
import enquirer from 'enquirer'
import colors from 'ansi-colors'
import {writePackage} from 'write-pkg'
import updateNotifier from 'update-notifier'
import sortKeys from 'sort-keys'
import createEsmUtils from 'esm-utils'
import tools from './tools/index.js'
import printEffects from './core/print-effects.js'
import projectPackage from './utils/package.js'

const {readJsonSync} = createEsmUtils(import.meta)

updateNotifier({pkg: readJsonSync('../package.json')}).notify()

// const HAS_YARN = hasYarn()
// const NPM_CLIENT = HAS_YARN ? 'yarn' : 'npm'
const NPM_CLIENT = 'yarn'

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
      ',',
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

  const {files, dependencies, packageJson} = printEffects(selectedTools)

  if (
    files.length !== 0 ||
    dependencies.length !== 0 ||
    packageJson.length !== 0
  ) {
    const {confirmed} = await enquirer.prompt({
      type: 'confirm',
      name: 'confirmed',
      message: 'confirmed effects above?',
      initial: true,
    })

    if (!confirmed) {
      return false
    }
  }

  await Promise.all(selectedTools.map((tool) => tool.install(tool)))
  for (const key of ['dependencies', 'scripts', 'devDependencies']) {
    if (projectPackage[key]) {
      projectPackage[key] = sortKeys(projectPackage[key])
    }
  }
  await writePackage(projectPackage)

  if (dependencies.length !== 0) {
    await installPackages()
  }

  return true
}

export default {run}
