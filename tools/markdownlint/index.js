module.exports = {
  effects: {
    files: [
      {
        source: 'files/config.json',
        dest: '.markdownlint.json',
      },
    ],
    dependencies: ['markdownlint-cli', 'npm-run-all'],
    'package.json': {
      'scripts["lint"]': 'run-p lint:*',
      'scripts["lint:markdown"]':
        'markdownlint "**/*.md" --ignore "**/node_modules/**"',
    },
  },
}
