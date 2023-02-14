import isNull from './is-null.js'

function isNullOrUndefined(x) {
  return isNull(x) || x === undefined
}

export default isNullOrUndefined
