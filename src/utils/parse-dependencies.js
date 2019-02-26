import latestVersion from 'latest-version'
import uniq from './uniq'

async function parseDependencies(dependencies) {
  dependencies = uniq(dependencies)

  const versions = await Promise.all(
    dependencies.map(dependency => latestVersion(dependency))
  )

  return dependencies.reduce(
    (all, dependency, index) =>
      Object.assign(all, {[dependency]: `^${versions[index]}`}),
    {}
  )
}

export default parseDependencies
