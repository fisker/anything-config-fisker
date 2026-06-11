export default {
  name: 'Husky (Uninstall)',
  *process({removeFile, updatePackageJson}) {
    yield removeFile(['.husky', '.huskyrc.js', '.huskyrc.cjs'])
    yield updatePackageJson({
      scripts: {
        prepare: undefined,
      },
      devDependencies: {
        'markdownlint-cli': undefined,
        'npm-run-all': undefined,
      },
    })
  },
}
