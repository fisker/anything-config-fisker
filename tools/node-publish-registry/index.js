module.exports = {
  name: 'registry for npm pulish',
  effects: {
    files: [],
    dependencies: [],
    'package.json': {
      key: 'publishConfig.registry',
      value: 'https://registry.npmjs.org/',
    },
  },
}
