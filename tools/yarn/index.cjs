module.exports = {
  name: 'Yarn',
  effects: {
    files: [
      {
        destination: '.yarnrc',
      },
      {
        source: 'files/yarnrc.yml',
        destination: '.yarnrc.yml',
      },
      {
        source: 'files/yarn-4.2.2.cjs',
        destination: '.yarn/releases/yarn-4.2.2.cjs',
      },
    ],
    dependencies: [],
    packageJson: {
      packageManager: 'yarn@4.2.2',
    },
  },
}
