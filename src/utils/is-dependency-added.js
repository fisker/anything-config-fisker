import pkg from './pkg'
import hasOwn from './has-own'

const dependencies = {
  ...pkg.dependencies,
  ...pkg.devDependencies,
}
function isDependencyAdded(dependency) {
  return hasOwn.call(dependencies, dependency)
}

export default isDependencyAdded
