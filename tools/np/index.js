module.exports = {
  effects: {
    files: [],
    dependencies: ['np'],
    package: {
      key: 'publishConfig.registry',
      value: 'https://registry.npmjs.org/',
    },
  },
  isInstalled({files, dependencies}, {exists}) {
    return files.some(exists) || dependencies.some(exists)
  },
}
