export default {
  name: 'sort-package-json',
  *process({
    copyFile,
    removeFile,
    installDevDependencies: installDevelopmentDependencies,
    updatePackageJson,
    LINT_SCRIPT,
    FIX_SCRIPT,
  }) {
    yield installDevelopmentDependencies(['sort-package-json', 'npm-run-all2'])
    yield updatePackageJson({
      scripts: {
        lint: LINT_SCRIPT,
        'lint:package-json': 'yarn run fix:package-json --check',
        fix: FIX_SCRIPT,
        'fix:package-json':
          'sort-package-json "package.json" "packages/*/package.json"',
      },
      devDependencies: {
        'npm-run-all': undefined,
        format: undefined,
        'format:package-json': undefined,
        'format:sort-package-json': undefined,
      },
    })
  },
}
