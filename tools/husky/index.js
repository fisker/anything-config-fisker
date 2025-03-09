export default {
  name: 'Husky',
  *process({
    copyFile,
    removeFile,
    installDevDependencies: installDevelopmentDependencies,
    updatePackageJson,
  }) {
    yield copyFile(
      new URL('./files/pre-commit.sh', import.meta.url),
      '.husky/pre-commit',
    )
    yield removeFile(['.huskyrc.js', '.huskyrc.cjs'])
    yield installDevelopmentDependencies('husky')
    yield updatePackageJson({
      scripts: {
        prepare: 'husky install',
      },
    })
  },
}
