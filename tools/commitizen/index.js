module.exports = {
  effects: {
    files: [],
    dependencies: ['cz-conventional-changelog-emoji'],
    'package.json': {
      key: 'config.commitizen.path',
      value: './node_modules/cz-conventional-changelog-emoji',
    },
  },
}
