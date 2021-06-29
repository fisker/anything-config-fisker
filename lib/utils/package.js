import {readPackageSync} from 'read-pkg'

const packageJson = readPackageSync({normalize: false})

export default packageJson
