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
    dependencies: ['eslint', '@fisker/eslint-config', 'prettier'],
    'package.json': {
      'scripts["lint:eslint"]': 'eslint **/*.{js,mjs,vue}',
      'scripts["format:eslint"]': 'yarn lint:eslint --fix',
    },
  },
}
