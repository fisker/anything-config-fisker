module.exports = {
  name: 'git related',
  effects: {
    files: [
      {
        source: 'files/git-ignore',
        dest: '.gitignore',
      },
      {
        source: 'files/git-attributes',
        dest: '.gitattributes',
      },
    ],
    dependencies: [],
    'package.json': {},
  },
}
