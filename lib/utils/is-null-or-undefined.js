import isNull from './is-null.js'
import isUndefined from './is-undefined.js'

function isNullOrUndefined(x) {
  return isNull(x) || isUndefined(x)
}

export default isNullOrUndefined
