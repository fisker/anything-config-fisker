module.exports = {
  files: [],
  dependencies: ['cz-conventional-changelog-emoji'],
  package: {
    config: {
      commitizen: {
        path: './node_modules/cz-conventional-changelog-emoji',
      },
    },
  },
}
