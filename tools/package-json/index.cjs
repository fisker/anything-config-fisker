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
      type: 'module',
      exports: './index.js',
    },
  },
}
