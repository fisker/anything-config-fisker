module.exports = {
  effects: {
    files: [],
    dependencies: ['cz-conventional-changelog-emoji'],
    'package.json': {
      'config.commitizen.path':
        './node_modules/cz-conventional-changelog-emoji',
    },
  },
}
