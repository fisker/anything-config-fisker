import isExists from './is-exists.js'

function notExists(x) {
  return !isExists(x)
}

export default notExists
