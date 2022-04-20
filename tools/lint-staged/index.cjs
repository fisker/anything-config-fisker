module.exports = {
  effects: {
    files: [
      {
        source: 'files/config.cjs',
        destination: 'lint-staged.config.cjs',
      },
      {
        destination: 'lint-staged.config.js',
      },
    ],
    dependencies: ['lint-staged', '@fisker/lint-staged-config'],
    packageJson: [],
  },
}
