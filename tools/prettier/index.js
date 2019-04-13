module.exports = {
  effects: {
    files: [
      '.prettierignore',
      {
        source: 'prettier-run-commands.js',
        dest: 'prettier.config.js',
      },
    ],
    dependencies: ['prettier', 'prettier-config-fisker'],
    'package.json': [],
  },
}
