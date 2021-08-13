import {readdirSync} from 'node:fs'
import {TOOLS_DIR} from '../constants.js'
import getConfig from './get-config.js'

const directories = readdirSync(TOOLS_DIR).sort()
const tools = directories.map((directory) => getConfig(directory))

export default tools
