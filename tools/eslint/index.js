module.exports = {
  name: 'ESLint',
  effects: {
    files: [
      '.eslintignore',
      {
        source: 'eslint-run-commands.js',
        dest: '.eslintrc.js',
      },
    ],
    dependencies: ['eslint', '@xwtec/eslint-config', 'prettier'],
    'package.json': [],
  },
}
