// const extensions = require('./prettier-run-commands')
//   .overrides.map(({files}) => files)
//   .map(glob => glob.match(/\*\.{?(.*?)(?:}|)$/)[1])
//   .join(',')

const extensions = 'css,html,js,json,less,md,scss,ts,vue,yaml,yml'

module.exports = {
  effects: {
    files: [
      '.prettierignore',
      {
        source: 'prettier-run-commands.js',
        dest: 'prettier.config.js',
      },
    ],
    dependencies: ['prettier', '@fisker/prettier-config', 'npm-run-all'],
    'package.json': {
      'scripts["format"]': 'run-p format:*',
      'scripts["format:prettier"]': `prettier **/*.{${extensions}} --write`,
    },
  },
}
