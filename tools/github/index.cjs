module.exports = {
  name: 'Github',
  effects: {
    files: [
      {
        destination: '.github/funding.yml',
      },
      {
        source: 'files/continuous-integration.yml',
        destination: '.github/workflows/continuous-integration.yml',
      },
    ],
    dependencies: [],
    packageJson: {},
  },
}
