import isNull from './is-null'
import isUndefined from './is-undefined'

function isNullOrUndefined(x) {
  return isNull(x) || isUndefined(x)
}

export default isNullOrUndefined
