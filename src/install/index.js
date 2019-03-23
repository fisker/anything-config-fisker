import writePkg from 'write-pkg'
import copyFiles from '../utils/copy-files'
import updateDependencies from '../utils/update-dependencies'
import updatePackage from '../utils/update-package'
import projectPackage from '../utils/pkg'

function install({effects}) {
  const {files, dependencies, pkg} = effects

  return Promise.all([
    copyFiles(files),
    updateDependencies(dependencies),
    updatePackage(pkg),
  ]).then(() => writePkg(projectPackage))
}

export default install
