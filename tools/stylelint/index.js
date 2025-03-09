export default {
  name: 'stylelint',
  *process({
    LINT_SCRIPT,
    FIX_SCRIPT,
    removeFile,
    copyFile,
    updatePackageJson,
    installDevDependencies: installDevelopmentDependencies,
    packageJson,
    runCommand: spawn,
  }) {
    yield copyFile(new URL('./files/ignore', '.stylelintignore'))
    yield copyFile(new URL('./files/config.cjs', 'stylelint.config.cjs'))
    yield removeFile(['stylelint.config.js'])
    yield installDevDependencies([
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
