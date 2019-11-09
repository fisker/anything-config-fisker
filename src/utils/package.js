import {sync as readPackage} from 'read-pkg'

const packageJson = readPackage({normalize: false})

export default packageJson
