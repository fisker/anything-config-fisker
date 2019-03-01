import isDependencyListed from './is-dependency-listed'

function dependencyParser(dependency) {
  if (typeof dependency === 'string') {
    dependency = {name: dependency}
  }

  const {name, version = null, type = null} = dependency

  const exists = isDependencyListed(name, type)

  return {
    name,
    version,
    type,
    exists,
  }
}

export default dependencyParser
