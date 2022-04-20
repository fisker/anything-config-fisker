module.exports = {
  effects: {
    files: [
      {
        destination: 'commitlint.config.cjs',
      },
      {
        destination: 'commitlint.config.js',
      },
    ],
    dependencies: [],
    packageJson: {
      "devDependencies['@commitlint/cli']": undefined,
      "devDependencies['@fisker/commitlint-config']": undefined,
    },
  },
}
