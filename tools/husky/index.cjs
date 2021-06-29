module.exports = {
  effects: {
    files: [
      {
        source: 'files/config.js',
        destination: '.huskyrc.cjs',
      },
    ],
    dependencies: ['husky', '@fisker/husky-config'],
    packageJson: [],
  },
}
