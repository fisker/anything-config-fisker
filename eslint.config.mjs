import fiskerEslintConfig from '@fisker/eslint-config'

export default [
  ...fiskerEslintConfig,
  {
    rules: {
      'sonarjs/no-dead-store': 'off',
      'no-await-in-loop': 'off',
      'no-unused-vars': 'warn',
    },
  },
]
