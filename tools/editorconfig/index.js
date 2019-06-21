module.exports = {
  name: 'EditorConfig',
  effects: {
    files: [
      {
        source: 'files/config.ini',
        dest: '.editorconfig',
      },
    ],
    dependencies: [],
    'package.json': [],
  },
}
