module.exports = {
  name: 'ESLint',
  effects: {
    files: ['.eslintignore', '.eslintrc.js'],
    dependencies: ['eslint', '@xwtec/eslint-config', 'prettier'],
    package: [],
  },
}
