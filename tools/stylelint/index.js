export default {
  name: 'stylelint',
  *process({
    LINT_SCRIPT,
    FIX_SCRIPT,
    removeFile,
    copyFile,
    updatePackageJson,
    installDevDependencies: installDevelopmentDependencies,
  }) {
    yield copyFile(
      new URL('./files/ignore', import.meta.url),
      '.stylelintignore',
    )
    yield copyFile(
      new URL('./files/config.cjs', import.meta.url),
      'stylelint.config.cjs',
    )
    yield removeFile(['stylelint.config.js'])
    yield installDevelopmentDependencies([
      'stylelint',
      '@fisker/stylelint-config',
      'prettier',
      'npm-run-all2',
    ])
    yield updatePackageJson({
      scripts: {
        lint: LINT_SCRIPT,
        'lint:stylelint': 'stylelint "**/*.{css,scss,less,html,scss,vue}"',
        fix: FIX_SCRIPT,
        'fix:stylelint': 'yarn lint:stylelint --fix',
      },
      devDependencies: {
        'npm-run-all': undefined,
        format: undefined,
        'format:stylelint': undefined,
      },
    })
  },
}
