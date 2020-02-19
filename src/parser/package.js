import package_ from '../utils/package'
import hasProperty from '../utils/is-object-has-path'
import getPathSegments from '../utils/get-path-segments'
import getValue from '../utils/get-object-value-by-path'

function packageParser({key, value}) {
  const segments = getPathSegments(key)
  const exists = hasProperty(package_, segments)
  const original = getValue(package_, segments)

  key = segments.map(seg => `[${JSON.stringify(seg)}]`).join('')

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
