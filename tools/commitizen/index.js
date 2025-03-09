export default {
  name: 'Commitizen (Uninstall)',
  *process({updatePackageJson}) {
    yield updatePackageJson({
      config: undefined,
      devDependencies: {
        'cz-conventional-changelog-emoji': undefined,
      },
    })
  },
}
