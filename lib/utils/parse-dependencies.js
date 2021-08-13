import latestVersion from 'latest-version'
import uniq from './uniq.js'

async function parseDependencies(dependencies) {
  dependencies = uniq(dependencies)

  const promises = dependencies.map((dependency) =>
    latestVersion(dependency).then(
      (version) => `^${version}`,
      () => 'latest'
    )
  )

  const versions = await Promise.all(promises)

  return Object.fromEntries(
    dependencies.map((dependency, index) => [dependency, versions[index]])
  )
}

export default parseDependencies
