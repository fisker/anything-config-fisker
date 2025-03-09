export default {
  name: 'Markdownlint',
  *process({
    copyFile,
    removeFile,
    installDevDependencies: installDevelopmentDependencies,
    updatePackageJson,
    LINT_SCRIPT,
    FIX_SCRIPT,
  }) {
    yield copyFile(
      new URL('./files/config.cjs', import.meta.url),
      '.markdownlint-cli2.cjs',
    )
    yield removeFile('.markdownlint.json')
    yield installDevelopmentDependencies([
      'markdownlint-cli2',
      '@fisker/markdownlint-cli2-config',
      'npm-run-all2',
    ])
    yield updatePackageJson({
      scripts: {
        lint: LINT_SCRIPT,
        'lint:markdown': 'markdownlint-cli2',
        fix: FIX_SCRIPT,
        'fix:markdown': 'yarn lint:markdown --fix',
        format: undefined,
        'format:markdown': undefined,
      },
      'markdownlint-cli': undefined,
      'npm-run-all': undefined,
    })
  },
}
