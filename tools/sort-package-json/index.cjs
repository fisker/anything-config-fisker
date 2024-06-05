module.exports = {
  effects: {
    files: [],
    dependencies: ['sort-package-json', 'npm-run-all2'],
    packageJson: {
      'scripts["lint"]': 'run-p "lint:*"',
      'scripts["lint:package-json"]': 'yarn run fix:package-json --check',
      'scripts["fix"]': 'run-p "fix:*"',
      'scripts["fix:package-json"]':
        'sort-package-json "package.json" "packages/*/package.json"',

      // Clean
      'devDependencies["npm-run-all"]': undefined,
      'scripts["format"]': undefined,
      'scripts["format:package-json"]': undefined,
      'scripts["format:sort-package-json"]': undefined,
    },
  },
}
