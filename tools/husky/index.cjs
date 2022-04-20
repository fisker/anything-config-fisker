module.exports = {
  effects: {
    files: [
      {
        source: 'files/pre-commit.sh',
        destination: '.husky/pre-commit',
      },
      {
        destination: '.huskyrc.js',
      },
      {
        destination: '.huskyrc.cjs',
      },
    ],
    dependencies: ['husky'],
    packageJson: {
      'scripts["prepare"]': 'husky install',
    },
  },
}
