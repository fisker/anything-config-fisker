export default {
  name: 'Lint staged',
  *process({
    copyFile,
    removeFile,
    installDevDependencies: installDevelopmentDependencies,
  }) {
    yield copyFile(
      new URL('./files/config.cjs', import.meta.url),
      'lint-staged.config.cjs',
    ),
      yield removeFile('lint-staged.config.js')
    yield installDevelopmentDependencies([
      'lint-staged',
      '@fisker/lint-staged-config',
    ])
  },
}
