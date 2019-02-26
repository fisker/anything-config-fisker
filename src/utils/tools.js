import {readdirSync} from 'fs'
import {join} from 'path'
import {TOOLS_DIR} from '../constants'

function loadToolConfig(name) {
  return {
    name,
    ...require(join(TOOLS_DIR, name)),
  }
}

const dirs = readdirSync(TOOLS_DIR)
const tools = dirs.map(loadToolConfig)

export default tools
