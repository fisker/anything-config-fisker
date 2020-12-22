import getPathSegments from './get-path-segments'
import isObject from './is-object'

function getValue(object, path) {
  if (!isObject(object)) {
    return null
  }

  const seg = getPathSegments(path)
  const {length} = seg

  for (let index = 0; index < length; index += 1) {
    const property = seg[index]

    if (index === length - 1) {
      return object[property]
    }

    if (!isObject(object[property])) {
      return null
    }

    object = object[property]
  }

  return object
}

export default getValue
