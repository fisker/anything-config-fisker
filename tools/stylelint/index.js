module.exports = {
  effects: {
    files: [
      {
        source: 'files/ignore',
        dest: '.stylelintignore',
      },
      {
        source: 'files/config.js',
        dest: 'stylelint.config.js',
      },
    ],
    dependencies: [
      'stylelint',
      '@fisker/stylelint-config',
      'prettier',
      'npm-run-all',
    ],
    'package.json': {
      'scripts["lint"]': 'run-p lint:*',
      'scripts["lint:stylelint"]': 'stylelint "**/*.{css,scss,less}"',
      'scripts["format"]': 'run-p format:*',
      'scripts["format:stylelint"]': 'yarn lint:stylelint --fix',
    },
  },
}
