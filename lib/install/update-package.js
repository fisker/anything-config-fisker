import packageJson from '../utils/package.js'
import setValue from '../utils/set-object-value-by-path.js'

function updatePackage(data) {
  for (const {key, value} of data) {
    setValue(packageJson, key, value)
  }
}

export default updatePackage
