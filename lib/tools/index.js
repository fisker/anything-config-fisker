import {readdirSync} from 'fs'
import getConfig from './get-config.js'
import {TOOLS_DIR} from '../constants.js'

const directories = readdirSync(TOOLS_DIR).sort()
const tools = directories.map(getConfig)

export default tools
