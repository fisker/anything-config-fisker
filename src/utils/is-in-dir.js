import {normalize} from 'path'

function isInDir(dir, file) {
  return normalize(file).startsWith(normalize(dir))
}

export default isInDir
