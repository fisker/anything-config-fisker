/*!
 * config file for `eslint`
 *
 * update: wget https://git.io/fhNxh
 * document: https://eslint.org/docs/user-guide/configuring
 */

module.exports = {
  root: true,
  parserOptions: {},
  extends: ['fisker'],
  settings: {},
  rules: {
    'no-console': 'off',
  },
  plugins: [],
  overrides: [
    {
      files: ['cli.js'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
