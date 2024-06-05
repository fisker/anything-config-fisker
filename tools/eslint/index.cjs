module.exports = {
  name: 'ESLint',
  effects: {
    files: [
      {
        source: 'files/ignore',
        destination: '.eslintignore',
      },
      {
        source: 'files/config.cjs',
        destination: '.eslintrc.cjs',
      },
      {
        destination: '.eslintrc.js',
      },
    ],
    dependencies: [
      'eslint',
      '@fisker/eslint-config',
      'prettier',
      'npm-run-all2',
    ],
    packageJson: {
      'scripts["lint"]': 'run-p "lint:*"',
      'scripts["lint:eslint"]': 'eslint "**/*.{js,jsx,mjs,cjs,vue}"',
      'scripts["fix"]': 'run-p "fix:*"',
      'scripts["fix:eslint"]': 'yarn lint:eslint --fix',

      // Clean
      'devDependencies["npm-run-all"]': undefined,
      'scripts["format"]': undefined,
      'scripts["format:eslint"]': undefined,
    },
  },
}
