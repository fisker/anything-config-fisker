import {readdirSync} from 'fs'
import getConfig from './get-config'
import {TOOLS_DIR} from '../constants'

const dirs = readdirSync(TOOLS_DIR).sort()
const tools = dirs.map(getConfig)

export default tools
