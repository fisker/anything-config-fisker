import writePkg from 'write-pkg'
import projectPackage from './pkg'
import setValue from './set-object-value-by-path'

function updatePackage(pkg, {key, value}) {
  return setValue(pkg, key, value)
}

function writePackage(pkg) {
  return writePkg.sync(pkg.reduce(updatePackage, projectPackage))
}

export default writePackage
