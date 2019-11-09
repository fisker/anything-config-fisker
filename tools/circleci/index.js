module.exports = {
  name: 'circleci',
  effects: {
    files: [
      {
        source: 'files/config.yml',
        destination: '.circleci/config.yml',
      },
    ],
    dependencies: [],
    packageJson: [],
  },
}
