import {readdirSync} from 'fs'
import {join, basename} from 'path'
import isToolInstalled from './is-tool-installed'
import {TOOLS_DIR, CWD} from '../constants'

function loadToolConfig(name) {
  const config = require(join(TOOLS_DIR, name))

  config.install = config.install !== false

  const {files = [], dependencies = [], pkg: json = {}} = config

  config.files = files.map(file => ({
    name: basename(file),
    source: join(TOOLS_DIR, name, file),
    target: join(CWD, file),
  }))

  config.dependencies = dependencies
  config.pkg = json

  const installed = isToolInstalled(config)

  return {
    name,
    ...config,
    installed,
  }
}

const dirs = readdirSync(TOOLS_DIR)
const tools = dirs.sort().map(loadToolConfig)

export default tools
