module.exports = {
  effects: {
    files: [
      {
        source: 'files/config.js',
        dest: 'lint-staged.config.js',
      },
    ],
    dependencies: ['lint-staged', '@fisker/lint-staged-config'],
    'package.json': [],
  },
}
