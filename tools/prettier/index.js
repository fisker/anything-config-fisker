// const extensions = require('./prettier-run-commands')
//   .overrides.map(({files}) => files)
//   .map(glob => glob.match(/\*\.{?(.*?)(?:}|)$/)[1])
//   .join(',')

const extensions = 'css,html,js,json,less,md,scss,ts,vue,yaml,yml'

module.exports = {
  effects: {
    files: [
      {
        source: 'files/ignore',
        dest: '.prettierignore',
      },
      {
        source: 'files/config.js',
        dest: 'prettier.config.js',
      },
    ],
    dependencies: ['prettier', '@fisker/prettier-config', 'npm-run-all'],
    'package.json': {
      'scripts["lint"]': 'run-p lint:*',
      'scripts["lint:prettier"]': `prettier "**/*.{${extensions}}" --check`,
      'scripts["format"]': 'run-p format:*',
      'scripts["format:prettier"]': 'yarn lint:prettier --write',
    },
  },
}
