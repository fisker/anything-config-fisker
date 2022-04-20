module.exports = {
  effects: {
    files: [
      {
        source: 'files/ignore',
        destination: '.prettierignore',
      },
      {
        source: 'files/config.cjs',
        destination: 'prettier.config.cjs',
      },
      {
        destination: 'prettier.config.js',
      },
    ],
    dependencies: ['prettier', '@fisker/prettier-config', 'npm-run-all'],
    packageJson: {
      'scripts["lint"]': 'run-p lint:*',
      'scripts["lint:prettier"]': 'prettier . --check',
      'scripts["format"]': 'run-p format:*',
      'scripts["format:prettier"]': 'yarn lint:prettier --write',
    },
  },
}
