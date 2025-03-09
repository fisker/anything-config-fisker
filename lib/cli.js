import process from 'node:process'
import {execa} from 'execa'
import enquirer from 'enquirer'
import updateNotifier from 'update-notifier'
import processTool from './process-tool.js'
import packageJson from '../package.json' with {type: 'json'}
import styleText from 'node-style-text'
import context from './context.js'

updateNotifier({pkg: packageJson}).notify()

const NPM_CLIENT = 'yarn'

async function selectTools() {
  const choices = tools.map(({name}, index, {length}) => {
    const maxIndexLength = String(length).length + 1

    const message = [
      styleText.gray(`${index + 1}.`.padStart(maxIndexLength)),
      styleText.bold(name),
    ].join(' ')

    return {
      name,
      value: name,
      message,
    }
  })

  let selectedNames

  try {
    ;({selectedNames} = await enquirer.prompt({
      type: 'multiselect',
      name: 'selectedNames',
      message: 'select config(s) you want install:',
      choices,
      pageSize: Math.min(choices.length, 15),
    }))
  } catch {
    return
  }

  if (selectedNames.length === 0) {
    return await selectTools()
  }

  const selected = tools.filter(({name}) => selectedNames.includes(name))
  const names = selected.map(({name}) => name)

  let confirmed = false
  try {
    ;({confirmed} = await enquirer.prompt({
      type: 'confirm',
      name: 'confirmed',
      message: `Install ${selected.length} selected config(s): ${names.join(
        ',',
      )}?`,
      initial: true,
    }))
  } catch {}

  if (!confirmed) {
    return await selectTools()
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
    console.log('Nothing to install.')
    return false
  }

  for (const tool of selectTools) {
    await processTool(tool)
  }
}

export default {run}
