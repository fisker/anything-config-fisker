export default {
  name: 'Lint staged (Uninstall)',
  *process({removeFile, updatePackageJson}) {
    yield removeFile(['lint-staged.config.js', 'lint-staged.config.cjs'])
    yield updatePackageJson({
      scripts: {
        prepare: undefined,
      },
      devDependencies: {
        'lint-staged': undefined,
        '@fisker/lint-staged-config': undefined,
      },
    })
  },
}
