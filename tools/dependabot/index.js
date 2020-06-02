module.exports = {
  effects: {
    files: [
      {
        source: 'files/config.yml',
        destination: '.github/dependabot.yml',
      },
      {
        destination: '.dependabot',
      },
    ],
    dependencies: [],
    packageJson: [],
  },
}
