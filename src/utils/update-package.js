import pkg from './pkg'
import setValue from './set-object-value-by-path'

function updatePackage(data) {
  for (const {key, value} of data) {
    setValue(pkg, key, value)
  }
}

export default updatePackage
