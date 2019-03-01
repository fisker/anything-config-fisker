import getPathSegments from './get-path-segments'
import isObject from './is-object'

function hasProp(obj, path) {
  if (!isObject(obj)) {
    return false
  }

  const seg = getPathSegments(path)
  const {length} = seg

  for (let i = 0; i < length; i += 1) {
    if (!isObject(obj)) {
      return false
    }

    const prop = seg[i]
    if (!(prop in obj)) {
      return false
    }

    obj = obj[prop]
  }

  return true
}

export default hasProp
