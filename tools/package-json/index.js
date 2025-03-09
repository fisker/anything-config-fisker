export default {
  name: 'package.json',
  *process({updatePackageJson}) {
    yield updatePackageJson({
      type: 'module',
      exports: './index.js',
    })
  },
}
