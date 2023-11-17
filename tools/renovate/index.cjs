module.exports = {
  effects: {
    files: [
      {
        source: 'files/config.json5',
        destination: 'renovate.json5',
      },
      {
        destination: 'renovate.json',
      },
    ],
    dependencies: [],
    packageJson: [],
  },
}
