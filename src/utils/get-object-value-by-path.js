import getPathSegments from './get-path-segments'
import isObject from './is-object'

function getValue(obj, path) {
  if (!isObject(obj)) {
    return null
  }

  const seg = getPathSegments(path)
  const {length} = seg

  for (let i = 0; i < length; i += 1) {
    const prop = seg[i]

    if (i === length - 1) {
      return obj[prop]
    }

    if (!isObject(obj[prop])) {
      return null
    }

    obj = obj[prop]
  }

  return obj
}

export default getValue
