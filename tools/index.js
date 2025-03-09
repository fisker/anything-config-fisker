import fs from 'node:fs/promises'
import url from 'node:url'
import path from 'node:path'

const files = await fs.glob('*/index.js', {
  cwd: import.meta.dirname,
})

const importTool = async (name) => {
  const file = path.join(import.meta.dirname, name)
  const {default: tool} = await import(url.pathToFileURL(file))

  if (typeof tool.name !== 'string') {
    throw new TypeError(`'name' is missing in '${file}'.`)
  }

  if (typeof tool.process !== 'function') {
    throw new TypeError(`'process' is missing in '${file}'.`)
  }

  return tool
}

const tools = await Array.fromAsync(files, (file) => importTool(file))

export default tools.sort((toolA, toolB) =>
  toolA.name.toLowerCase().localeCompare(toolB.name.toLowerCase()),
)
