module.exports = {
  name: 'EditorConfig',
  effects: {
    files: [
      {
        source: 'files/config.ini',
        destination: '.editorconfig',
      },
    ],
    dependencies: [],
    packageJson: [],
  },
}
