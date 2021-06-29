import packageJson from '../utils/package.js'
import hasOwn from '../utils/has-own.js'

const {dependencies = {}, devDependencies: developmentDependencies = {}} =
  packageJson

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
