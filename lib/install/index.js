import copyFiles from '../utils/copy-files.js'
import updateDependencies from './update-dependencies.js'
import updatePackage from './update-package.js'

function install({effects}) {
  const {files, dependencies, packageJson} = effects

  return Promise.all([
    copyFiles(files),
    updateDependencies(dependencies),
    updatePackage(packageJson),
  ])
}

export default install
