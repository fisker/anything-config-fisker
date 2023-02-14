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
        source: 'files/yarn-3.4.1.cjs',
        destination: '.yarn/releases/yarn-3.4.1.cjs',
      },
    ],
    dependencies: [],
    packageJson: {
      packageManager: 'yarn@3.4.1',
    },
  },
}
