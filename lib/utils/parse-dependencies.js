import latestVersion from 'latest-version'
import uniq from './uniq'

async function parseDependencies(dependencies) {
  dependencies = uniq(dependencies)

  const promises = dependencies.map((dependency) =>
    latestVersion(dependency).then(
      (version) => `^${version}`,
      () => 'latest'
    )
  )

  const versions = await Promise.all(promises)

  return dependencies.reduce(
    (all, dependency, index) =>
      Object.assign(all, {[dependency]: versions[index]}),
    {}
  )
}

export default parseDependencies
