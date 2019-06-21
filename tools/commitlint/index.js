module.exports = {
  effects: {
    files: [
      {
        source: 'files/config.js',
        dest: 'commitlint.config.js',
      },
    ],
    dependencies: ['@commitlint/cli', '@fisker/commitlint-config'],
    'package.json': [],
  },
}
