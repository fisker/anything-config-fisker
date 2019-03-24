import pkg from '../utils/pkg'
import hasProp from '../utils/is-object-has-path'
import getPathSegments from '../utils/get-path-segments'
import getValue from '../utils/get-object-value-by-path'

function packageParser({key, value}) {
  const segments = getPathSegments(key)
  const exists = hasProp(pkg, segments)
  const original = getValue(pkg, segments)

  key = segments.map(seg => `[${JSON.stringify(seg)}]`).join('')

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
