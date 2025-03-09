export default {
  name: 'Commitlint (Uninstall)',
  *process({removeFile, updatePackageJson}) {
    yield removeFile('commitlint.config.cjs')
    yield updatePackageJson({
      devDependencies: {
        '@commitlint/cli': undefined,
        '@fisker/commitlint-config': undefined,
      },
    })
  },
}
