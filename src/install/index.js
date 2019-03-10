import copyFiles from '../utils/copy-files'
import writeDependencies from '../utils/write-dependencies'
import writePackage from '../utils/write-package'

function install({effects}) {
  const {files, dependencies, pkg} = effects

  return Promise.all([
    copyFiles(files),
    writeDependencies(dependencies),
    writePackage(pkg),
  ])
}

export default install
