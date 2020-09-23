import path from 'path'
import fs from 'fs'
import isPathInside from 'is-path-inside'
import isPathInCwd from 'is-path-in-cwd'
import {CWD} from '../constants'

function fileParser(file, directory) {
  if (typeof file === 'string') {
    file = {source: file}
  }

  let {source, destination = source} = file
  let sourceFile
  let sourceRelative

  if (source) {
    source = path.join(directory, source)
    if (!isPathInside(source, directory) || !fs.existsSync(source)) {
      return null
    }
    sourceFile = path.relative(directory, source)
    sourceRelative = path.relative(directory, source)
  }

  destination = path.join(CWD, destination)

  if (!isPathInCwd(destination)) {
    return null
  }

  const exists = fs.existsSync(destination)

  return {
    file: sourceFile,
    source,
    sourceRelative,
    destination,
    destinationRelative: path.relative(CWD, destination),
    exists,
  }
}

export default fileParser
