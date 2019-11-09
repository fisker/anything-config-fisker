import copyFiles from '../utils/copy-files'
import updateDependencies from './update-dependencies'
import updatePackage from './update-package'

function install({effects}) {
  const {files, dependencies, packageJson} = effects

  return Promise.all([
    copyFiles(files),
    updateDependencies(dependencies),
    updatePackage(packageJson),
  ])
}

export default install
