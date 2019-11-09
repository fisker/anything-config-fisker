module.exports = {
  name: 'npm & yarn related',
  effects: {
    files: [
      {
        source: 'files/npmrc',
        destination: '.npmrc',
      },
      {
        source: 'files/yarnrc',
        destination: '.yarnrc',
      },
    ],
    dependencies: [],
    packageJson: {},
  },
}
