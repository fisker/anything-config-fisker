import packageJson from '../utils/package'
import hasOwn from '../utils/has-own'

const {
  dependencies = {},
  devDependencies: developmentDependencies = {},
} = packageJson

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
