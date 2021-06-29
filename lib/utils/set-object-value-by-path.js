import getPathSegments from './get-path-segments.js'
import isObject from './is-object.js'

function setValue(object, path, value) {
  if (!isObject(object)) {
    return object
  }

  const seg = getPathSegments(path)
  const {length} = seg
  const root = object

  for (let index = 0; index < length; index += 1) {
    const property = seg[index]

    if (index === length - 1) {
      object[property] = value

      return root
    }

    if (!isObject(object[property])) {
      object[property] = {}
    }

    object = object[property]
  }

  return root
}

export default setValue
