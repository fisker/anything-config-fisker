module.exports = {
  effects: {
    files: ['.stylelintignore', 'stylelint.config.js'],
    dependencies: ['stylelint', '@fisker/stylelint-config', 'prettier'],
    'package.json': {
      'scripts["lint:style"]': 'stylelint **/*.{css,scss,less} --fix',
    },
  },
}
