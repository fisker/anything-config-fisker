module.exports = {
  name: 'git related',
  effects: {
    files: [
      {
        source: 'files/git-ignore',
        destination: '.gitignore',
      },
      {
        source: 'files/git-attributes',
        destination: '.gitattributes',
      },
    ],
    dependencies: [],
    packageJson: {},
  },
}
