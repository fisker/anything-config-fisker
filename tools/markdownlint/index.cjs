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
      'npm-run-all',
    ],
    packageJson: {
      'scripts["lint"]': 'run-p lint:*',
      'scripts["lint:markdown"]': 'markdownlint-cli2',
      'scripts["format"]': 'run-p format:*',
      'scripts["format:markdown"]': 'markdownlint-cli2-fix',
    },
  },
}
