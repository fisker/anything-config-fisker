import latestVersion from 'latest-version'
import writePackage from './write-package'
import isExists from '../tools/is-exists'

async function writeDependency({type, name}) {
  const key = [type || 'devDependency', name]
  const version = await latestVersion(name)
  const value = version ? `^${version}` : 'latest'

  return writePackage([
    {
      key,
      value,
    },
  ])
}

function writeDependencies(dependencies) {
  return dependencies.filter(isExists).map(writeDependency)
}

export default writeDependencies
