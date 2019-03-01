import {join, relative} from 'path'
import {existsSync} from 'fs'
import {CWD} from '../constants'
import isInDir from '../utils/is-in-dir'

function fileParser(file, dir) {
  if (typeof file === 'string') {
    file = {source: file}
  }

  let {source, dest = source} = file

  source = join(dir, source)
  if (!isInDir(dir, source) || !existsSync(source)) {
    return null
  }

  dest = join(CWD, dest)

  if (!isInDir(CWD, dest)) {
    return null
  }

  const exists = existsSync(dest)

  return {
    file: relative(dir, source),
    source,
    sourceRelative: relative(dir, source),
    dest,
    destRelative: relative(CWD, dest),
    exists,
  }
}

export default fileParser
