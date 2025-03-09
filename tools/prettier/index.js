export default {
  name: 'Prettier',
  *process({
    copyFile,
    removeFile,
    installDevDependencies: installDevelopmentDependencies,
    updatePackageJson,
    LINT_SCRIPT,
    FIX_SCRIPT,
  }) {
    yield copyFile(
      new URL('./files/ignore', import.meta.url),
      '.prettierignore',
    )
    yield copyFile(
      new URL('./files/config.mjs', import.meta.url),
      'prettier.config.mjs',
    )
    yield removeFile(['prettier.config.js'])
    yield installDevelopmentDependencies([
      'prettier',
      '@fisker/prettier-config',
      'npm-run-all2',
    ])
    yield updatePackageJson({
      scripts: {
        lint: LINT_SCRIPT,
        'lint:prettier': 'prettier . --check',
        fix: FIX_SCRIPT,
        'fix:prettier': 'prettier . --write',
      },
      devDependencies: {
        'npm-run-all': undefined,
        format: undefined,
        'format:prettier': undefined,
      },
    })
  },
}
