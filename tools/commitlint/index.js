module.exports = {
  effects: {
    files: [
      {
        source: 'files/config.js',
        destination: 'commitlint.config.js',
      },
    ],
    dependencies: ['@commitlint/cli', '@fisker/commitlint-config'],
    packageJson: [],
  },
}
