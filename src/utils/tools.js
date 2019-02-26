import {readdirSync} from 'fs'
import {join, relative} from 'path'
import isToolInstalled from './is-tool-installed'
import {TOOLS_DIR, CWD} from '../constants'

function loadToolConfig(dirName) {
  const config = require(join(TOOLS_DIR, dirName))

  config.installByDefault = config.installByDefault !== false

  const {files = [], dependencies = [], pkg: json = {}} = config

  config.files = files.map(file => {
    const dir = join(TOOLS_DIR, dirName)
    const source = join(dir, file)
    const target = join(CWD, file)
    const path = relative(dir, source)

    return {
      path,
      dir,
      source,
      target,
    }
  })

  config.dependencies = dependencies
  config.pkg = json

  return {
    name: dirName,
    ...config,
    isInstalled: isToolInstalled(config),
  }
}

const dirs = readdirSync(TOOLS_DIR)
const tools = dirs.sort().map(loadToolConfig)

export default tools
