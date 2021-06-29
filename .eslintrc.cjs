/*!
 * config file for `eslint`
 *
 * update: wget -O .eslintrc.js https://git.io/fjVjK
 * document: https://eslint.org/docs/user-guide/configuring
 */

/* @fisker/eslint-config https://git.io/fjOeH */

module.exports = {
  root: true,
  env: {},
  parserOptions: {},
  extends: ['@fisker'],
  settings: {},
  rules: {},
  plugins: [],
  globals: {},
  overrides: [
    {
      files: [
        'tools/commitlint/files/config.js',
        'tools/eslint/files/config.js',
        'tools/husky/files/config.js',
        'tools/lint-staged/files/config.js',
        'tools/prettier/files/config.js',
        'tools/stylelint/files/config.js',
      ],
      parserOptions: {sourceType: 'script'},
      env: {node: true},
      globals: {
        require: 'readonly',
        module: 'readonly',
      },
    },
  ],
}
