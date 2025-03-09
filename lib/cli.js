import enquirer from 'enquirer'
import styleText from 'node-style-text'
import updateNotifier from 'update-notifier'
import packageJson from '../package.json' with {type: 'json'}
import tools from '../tools/index.js'
import processTool from './process-tool.js'

updateNotifier({pkg: packageJson}).notify()

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

async function run() {
  const tools = await selectTools()

  if (tools.length === 0) {
    console.log('Nothing to install.')
    return false
  }

  for (const tool of tools) {
    await processTool(tool)
  }
}

export default {run}
