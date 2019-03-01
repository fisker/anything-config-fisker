import isNull from './is-null'

function isObject(x) {
  const type = typeof x
  return !isNull(x) && (type === 'object' || type === 'function')
}

export default isObject
