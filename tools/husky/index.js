module.exports = {
  effects: {
    files: [
      {
        source: 'files/config.js',
        destination: '.huskyrc.js',
      },
    ],
    dependencies: ['husky', '@fisker/husky-config'],
    packageJson: [],
  },
}
