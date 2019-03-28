import getPathSegments from './get-path-segments'
import isObject from './is-object'

function setValue(object, path, value) {
  if (!isObject(object)) {
    return object
  }

  const seg = getPathSegments(path)
  const {length} = seg
  const root = object

  for (let i = 0; i < length; i += 1) {
    const property = seg[i]

    if (i === length - 1) {
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
