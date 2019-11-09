import packageJson from '../utils/package'
import setValue from '../utils/set-object-value-by-path'

function updatePackage(data) {
  for (const {key, value} of data) {
    setValue(packageJson, key, value)
  }
}

export default updatePackage
