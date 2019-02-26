import pkg from './pkg'
import hasOwn from './has-own'

function isDependencyAdded(dependency) {
  return (
    hasOwn.call(pkg.dependencies, dependency) ||
    hasOwn.call(pkg.devDependencies, dependency)
  )
}

export default isDependencyAdded
