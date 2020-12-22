import getPathSegments from './get-path-segments'
import isObject from './is-object'

function hasProperty(object, path) {
  if (!isObject(object)) {
    return false
  }

  const seg = getPathSegments(path)
  const {length} = seg

  for (let index = 0; index < length; index += 1) {
    if (!isObject(object)) {
      return false
    }

    const property = seg[index]
    if (!(property in object)) {
      return false
    }

    object = object[property]
  }

  return true
}

export default hasProperty
