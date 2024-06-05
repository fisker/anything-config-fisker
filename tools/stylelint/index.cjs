module.exports = {
  effects: {
    files: [
      {
        source: 'files/ignore',
        destination: '.stylelintignore',
      },
      {
        source: 'files/config.cjs',
        destination: 'stylelint.config.cjs',
      },
      {
        destination: 'stylelint.config.js',
      },
    ],
    dependencies: [
      'stylelint',
      '@fisker/stylelint-config',
      'prettier',
      'npm-run-all2',
    ],
    packageJson: {
      'scripts["lint"]': 'run-p "lint:*"',
      'scripts["lint:stylelint"]':
        'stylelint "**/*.{css,scss,less,html,scss,vue}"',
      'scripts["fix"]': 'run-p "fix:*"',
      'scripts["fix:stylelint"]': 'yarn lint:stylelint --fix',

      // Clean
      'devDependencies["npm-run-all"]': undefined,
      'scripts["format"]': undefined,
      'scripts["format:stylelint"]': undefined,
    },
  },
}
