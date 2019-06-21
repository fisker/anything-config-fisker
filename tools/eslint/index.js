module.exports = {
  name: 'ESLint',
  effects: {
    files: [
      {
        source: 'files/ignore',
        dest: '.eslintignore',
      },
      {
        source: 'files/config.js',
        dest: '.eslintrc.js',
      },
    ],
    dependencies: [
      'eslint',
      '@fisker/eslint-config',
      'prettier',
      'npm-run-all',
    ],
    'package.json': {
      'scripts["lint"]': 'run-p lint:*',
      'scripts["lint:eslint"]': 'eslint "**/*.{js,mjs,vue}"',
      'scripts["format"]': 'run-p format:*',
      'scripts["format:eslint"]': 'yarn lint:eslint --fix',
    },
  },
}
