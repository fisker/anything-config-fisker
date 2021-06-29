module.exports = {
  effects: {
    files: [
      {
        source: 'files/ignore',
        destination: '.stylelintignore',
      },
      {
        source: 'files/config.js',
        destination: 'stylelint.config.cjs',
      },
    ],
    dependencies: [
      'stylelint',
      '@fisker/stylelint-config',
      'prettier',
      'npm-run-all',
    ],
    packageJson: {
      'scripts["lint"]': 'run-p lint:*',
      'scripts["lint:stylelint"]': 'stylelint "**/*.{css,scss,less}"',
      'scripts["format"]': 'run-p format:*',
      'scripts["format:stylelint"]': 'yarn lint:stylelint --fix',
    },
  },
}
