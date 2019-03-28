import package_ from '../utils/pkg'
import hasOwn from '../utils/has-own'

const {
  dependencies = {},
  devDependencies: developmentDependencies = {},
} = package_

const packageDependencies = {
  any: {
    ...dependencies,
    ...developmentDependencies,
  },
  dependencies,
  devDependencies: developmentDependencies,
}

function isDependencyListed(dependency, type) {
  return hasOwn.call(packageDependencies[type || 'any'], dependency)
}

export default isDependencyListed
