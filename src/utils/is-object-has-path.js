import getPathSegments from './get-path-segments'
import isObject from './is-object'

function hasProperty(object, path) {
  if (!isObject(object)) {
    return false
  }

  const seg = getPathSegments(path)
  const {length} = seg

  for (let i = 0; i < length; i += 1) {
    if (!isObject(object)) {
      return false
    }

    const property = seg[i]
    if (!(property in object)) {
      return false
    }

    object = object[property]
  }

  return true
}

export default hasProperty
