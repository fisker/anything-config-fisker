module.exports = {
  effects: {
    files: [],
    dependencies: ['sort-package-json', 'npm-run-all'],
    packageJson: {
      'scripts["lint"]': 'run-p "lint:*"',
      'scripts["lint:package-json"]': 'yarn run format:package-json --check',
      'scripts["format"]': 'run-p "format:*"',
      'scripts["format:package-json"]':
        'sort-package-json "package.json" "packages/*/package.json"',
      'scripts["format:sort-package-json"]': undefined,
    },
  },
}
