import package_ from '../utils/package'
import setValue from '../utils/set-object-value-by-path'

function updatePackage(data) {
  for (const {key, value} of data) {
    setValue(package_, key, value)
  }
}

export default updatePackage
