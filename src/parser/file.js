import {join, relative} from 'path'
import {existsSync} from 'fs'
import {CWD} from '../constants'
import isInDirectory from '../utils/is-in-dir'

function fileParser(file, directory) {
  if (typeof file === 'string') {
    file = {source: file}
  }

  let {source, dest: destination = source} = file

  source = join(directory, source)
  if (!isInDirectory(directory, source) || !existsSync(source)) {
    return null
  }

  destination = join(CWD, destination)

  if (!isInDirectory(CWD, destination)) {
    return null
  }

  const exists = existsSync(destination)

  return {
    file: relative(directory, source),
    source,
    sourceRelative: relative(directory, source),
    dest: destination,
    destRelative: relative(CWD, destination),
    exists,
  }
}

export default fileParser
