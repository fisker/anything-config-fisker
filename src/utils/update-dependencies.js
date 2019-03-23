import latestVersion from 'latest-version'
import isExists from '../tools/is-exists'
import updatePackage from './update-package'

async function updateDependency({type, name}) {
  const key = [type || 'devDependencies', name]
  const version = await latestVersion(name)
  const value = version ? `^${version}` : 'latest'

  return updatePackage([
    {
      key,
      value,
    },
  ])
}

function updateDependencies(dependencies) {
  return dependencies.filter(isExists).map(updateDependency)
}

export default updateDependencies
