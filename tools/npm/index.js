module.exports = {
  name: 'npm related',
  effects: {
    files: [
      {
        source: 'files/npmrc',
        dest: '.npmrc',
      },
      {
        source: 'files/yarnrc',
        dest: '.yarnrc',
      },
    ],
    dependencies: [],
    'package.json': {},
  },
}
