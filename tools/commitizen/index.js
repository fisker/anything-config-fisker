module.exports = {
  effects: {
    files: [],
    dependencies: ['cz-conventional-changelog'],
    'package.json': {
      'config.commitizen.path': './node_modules/cz-conventional-changelog',
      "devDependencies['cz-conventional-changelog-emoji']": undefined,
    },
  },
}
