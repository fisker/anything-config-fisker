import context from './context.js'

async function processTool(tool) {
  const result = await tool.process(context)

  if (!result) {
    return
  }

  if (result[Symbol.iterator]) {
    for (const promise of result) {
      await promise
    }
  }

  if (result[Symbol.asyncIterator]) {
    for await (const promise of result) {
      await promise
    }
  }
}

export default processTool
