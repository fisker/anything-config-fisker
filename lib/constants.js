import path from 'node:path'
import process from 'node:process'
import createEsmUtils from 'esm-utils'

const {dirname} = createEsmUtils(import.meta)

export const TOOLS_DIR = path.join(dirname, '../tools/')
export const CWD = process.cwd()
