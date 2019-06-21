module.exports = {
  effects: {
    files: [
      {
        source: 'files/config.js',
        dest: '.huskyrc.js',
      },
    ],
    dependencies: ['husky', '@fisker/husky-config'],
    'package.json': [],
  },
}
