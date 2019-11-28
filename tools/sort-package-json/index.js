module.exports = {
  effects: {
    files: [],
    dependencies: ['sort-package-json', 'npm-run-all'],
    packageJson: {
      'scripts["format:sort-package-json"]':
        'sort-package-json "package.json" "packages/*/package.json"',
    },
  },
}
