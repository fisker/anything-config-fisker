import package_ from '../utils/package.js'
import hasProperty from '../utils/is-object-has-path.js'
import getPathSegments from '../utils/get-path-segments.js'
import getValue from '../utils/get-object-value-by-path.js'

function packageParser({key, value}) {
  const segments = getPathSegments(key)
  const exists = hasProperty(package_, segments)
  const original = getValue(package_, segments)

  key = segments.map((seg) => `[${JSON.stringify(seg)}]`).join('')

  if (typeof value === 'function') {
    value = value(package_)
  }

  const equal = JSON.stringify(original) === JSON.stringify(value)

  return {
    key,
    segments,
    value,
    exists,
    original,
    equal,
  }
}

export default packageParser
