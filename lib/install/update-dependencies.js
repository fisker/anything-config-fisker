import latestVersion from 'latest-version'
import notExists from '../tools/not-exists.js'
import updatePackage from './update-package.js'

async function updateDependency({type, name}) {
  const key = [type || 'devDependencies', name]
  const version = await latestVersion(name)
  const value = version ? `${version}` : 'latest'

  updatePackage([
    {
      key,
      value,
    },
  ])
}

async function updateDependencies(dependencies) {
  await Promise.all(
    dependencies
      .filter((dependency) => notExists(dependency))
      .map((dependency) => updateDependency(dependency)),
  )
}

export default updateDependencies
