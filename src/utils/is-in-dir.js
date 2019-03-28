import {normalize} from 'path'

function isInDirectory(directory, file) {
  return normalize(file).startsWith(normalize(directory))
}

export default isInDirectory
