module.exports = {
  effects: {
    files: [
      {
        source: 'files/config.cjs',
        destination: '.markdownlint-cli2.cjs',
      },
      {
        destination: '.markdownlint.json',
      },
    ],
    dependencies: [
      'markdownlint-cli2',
      '@fisker/markdownlint-cli2-config',
      'npm-run-all2',
    ],
    packageJson: {
      'scripts["lint"]': 'run-p "lint:*"',
      'scripts["lint:markdown"]': 'markdownlint-cli2',
      'scripts["fix"]': 'run-p "fix:*"',
      'scripts["fix:markdown"]': 'markdownlint-cli2-fix',

      // Clean
      'devDependencies["markdownlint-cli"]': undefined,
      'devDependencies["npm-run-all"]': undefined,
      'scripts["format"]': undefined,
      'scripts["format:markdown"]': undefined,
    },
  },
}
