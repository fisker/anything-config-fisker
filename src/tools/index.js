import {readdirSync} from 'fs'
import getConfig from './get-config'
import {TOOLS_DIR} from '../constants'

const directories = readdirSync(TOOLS_DIR).sort()
const tools = directories.map(getConfig)

export default tools
