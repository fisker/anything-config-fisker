module.exports = {
  name: 'ESLint',
  effects: {
    files: [
      {
        source: 'files/ignore',
        destination: '.eslintignore',
      },
      {
        source: 'files/config.js',
        destination: '.eslintrc.js',
      },
    ],
    dependencies: [
      'eslint',
      '@fisker/eslint-config',
      'prettier',
      'npm-run-all',
    ],
    packageJson: {
      'scripts["lint"]': 'run-p lint:*',
      'scripts["lint:eslint"]': 'eslint "**/*.{js,mjs,vue}"',
      'scripts["format"]': 'run-p format:*',
      'scripts["format:eslint"]': 'yarn lint:eslint --fix',
    },
  },
}
