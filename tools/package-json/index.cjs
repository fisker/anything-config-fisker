module.exports = {
  name: 'package.json',
  effects: {
    dependencies: [
      'eslint',
      '@fisker/eslint-config',
      'prettier',
      'npm-run-all',
    ],
    packageJson: {
      'scripts["type"]': 'module',
      'scripts["exports"]': 'index.js',
    },
  },
}
