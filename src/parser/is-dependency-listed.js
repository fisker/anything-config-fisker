import pkg from '../utils/pkg'
import hasOwn from '../utils/has-own'

const {dependencies = {}, devDependencies = {}} = pkg

const pkgDependencies = {
  any: {
    ...dependencies,
    ...devDependencies,
  },
  dependencies,
  devDependencies,
}

function isDependencyListed(dependency, type) {
  return hasOwn.call(pkgDependencies[type || 'any'], dependency)
}

export default isDependencyListed
