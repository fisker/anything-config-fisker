import {join, relative} from 'path'
import {existsSync} from 'fs'
import isPathInside from 'is-path-inside'
import isPathInCwd from 'is-path-in-cwd'
import {CWD} from '../constants'

function fileParser(file, directory) {
  if (typeof file === 'string') {
    file = {source: file}
  }

  let {source, destination = source} = file

  source = join(directory, source)
  if (!isPathInside(source, directory) || !existsSync(source)) {
    return null
  }

  destination = join(CWD, destination)

  if (!isPathInCwd(destination)) {
    return null
  }

  const exists = existsSync(destination)

  return {
    file: relative(directory, source),
    source,
    sourceRelative: relative(directory, source),
    destination,
    destinationRelative: relative(CWD, destination),
    exists,
  }
}

export default fileParser
