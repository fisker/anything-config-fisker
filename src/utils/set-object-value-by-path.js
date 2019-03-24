import getPathSegments from './get-path-segments'
import isObject from './is-object'

function setValue(obj, path, value) {
  if (!isObject(obj)) {
    return obj
  }

  const seg = getPathSegments(path)
  const {length} = seg
  const root = obj

  for (let i = 0; i < length; i += 1) {
    const prop = seg[i]

    if (i === length - 1) {
      obj[prop] = value

      return root
    }

    if (!isObject(obj[prop])) {
      obj[prop] = {}
    }

    obj = obj[prop]
  }

  return root
}

export default setValue
