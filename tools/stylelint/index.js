module.exports = {
  effects: {
    files: ['.stylelintignore', 'stylelint.config.js'],
    dependencies: ['stylelint', '@fisker/stylelint-config', 'prettier'],
    'package.json': {
      'scripts["lint:stylelint"]': 'stylelint **/*.{css,scss,less}',
      'scripts["format:stylelint"]': 'yarn lint:stylelint --fix',
    },
  },
}
