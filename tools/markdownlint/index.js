module.exports = {
  effects: {
    files: ['.markdownlint.json'],
    dependencies: ['markdownlint-cli'],
    'package.json': {
      'scripts["lint:markdown"]':
        'markdownlint **/*.md --ignore "**/node_modules/**"',
    },
  },
}
