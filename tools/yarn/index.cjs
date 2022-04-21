module.exports = {
  name: 'Yarn',
  effects: {
    files: [
      {
        destination: '.yarnrc',
      },
      {
        source: 'files/yarnrc.yml',
        destination: '.yarnrc.yml',
      },
    ],
    dependencies: [],
    packageJson: {
      packageManager: 'yarn@3.2.0',
    },
  },
}
