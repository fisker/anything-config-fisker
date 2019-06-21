module.exports = {
  name: 'gitignore',
  effects: {
    files: [
      {
        source: 'files/ignore',
        dest: '.gitignore',
      },
    ],
    dependencies: [],
    'package.json': {},
  },
}
