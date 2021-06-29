module.exports = {
  effects: {
    files: [
      {
        source: 'files/config.js',
        destination: 'commitlint.config.cjs',
      },
    ],
    dependencies: ['@commitlint/cli', '@fisker/commitlint-config'],
    packageJson: [],
  },
}
