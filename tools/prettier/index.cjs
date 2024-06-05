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
    dependencies: ['prettier', '@fisker/prettier-config', 'npm-run-all2'],
    packageJson: {
      'scripts["lint"]': 'run-p "lint:*"',
      'scripts["lint:prettier"]': 'prettier . --check',
      'scripts["fix"]': 'run-p "fix:*"',
      'scripts["fix:prettier"]': 'yarn lint:prettier --write',


      // Clean
      'devDependencies["npm-run-all"]': undefined,
      'scripts["format"]': undefined,
      'scripts["format:prettier"]': undefined,
    },
  },
}
