import pkg from '../utils/pkg'
import setValue from '../utils/set-object-value-by-path'

function updatePackage(data) {
  for (const {key, value} of data) {
    Object.keys(pkg).forEach(key => delete pkg[key])
    setValue(pkg, key, value)
  }
}

export default updatePackage
