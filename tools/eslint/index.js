export default {
  name: 'ESLint',
  *process({
    removeFile,
    installDevDependencies: installDevelopmentDependencies,
    copyFile,
    updatePackageJson,
    LINT_SCRIPT,
    FIX_SCRIPT,
  }) {
    yield removeFile(['.eslintrc.js', '.eslintrc.cjs', '.eslintignore'])
    yield copyFile(
      new URL('./files/config.mjs', import.meta.url),
      'eslint.config.mjs',
    )
    yield installDevelopmentDependencies([
      'eslint',
      '@fisker/eslint-config',
      'prettier',
      'npm-run-all2',
    ])
    yield updatePackageJson({
      scripts: {
        lint: LINT_SCRIPT,
        'lint:eslint': 'eslint .',
        fix: FIX_SCRIPT,
        'fix:eslint': 'yarn lint:eslint --fix',
      },
      devDependencies: {
        'npm-run-all': undefined,
        format: undefined,
        'format:eslint': undefined,
      },
    })
  },
}
