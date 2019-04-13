module.exports = {
  effects: {
    files: ['.stylelintignore', 'stylelint.config.js'],
    dependencies: ['stylelint', 'stylelint-config-fisker', 'prettier'],
    'package.json': {
      'scripts["lint:style"]': 'stylelint **/*.{css,scss,less} --fix',
    },
  },
}
