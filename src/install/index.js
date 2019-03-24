import copyFiles from '../utils/copy-files'
import updateDependencies from './update-dependencies'
import updatePackage from './update-package'

function install({effects}) {
  const {files, dependencies, pkg} = effects

  return Promise.all([
    copyFiles(files),
    updateDependencies(dependencies),
    updatePackage(pkg),
  ])
}

export default install
