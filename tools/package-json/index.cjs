module.exports = {
  name: 'package.json',
  effects: {
    dependencies: [],
    packageJson: {
      type: 'module',
      exports: './index.js',
    },
  },
}
