module.exports = {
  name: 'npm related',
  effects: {
    files: [
      {
        source: 'files/npmrc',
        dest: '.npmrc',
      },
    ],
    dependencies: [],
    'package.json': {},
  },
}
