module.exports = {
  effects: {
    files: [
      {
        source: 'files/config.js',
        destination: 'lint-staged.config.cjs',
      },
    ],
    dependencies: ['lint-staged', '@fisker/lint-staged-config'],
    packageJson: [],
  },
}
