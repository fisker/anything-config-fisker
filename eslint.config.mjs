import fiskerEslintConfig from '@fisker/eslint-config'

const ignores = `
!.*

# vendors
**/node_modules/**
**/vendors/**
**/vendor/**
**/third-party/**

# build file
**/dist/**
**/*.min.*

# fixtures
**/fixtures/**

# test
**/.nyc_output/**
**/coverage/**

# yarn
**/.yarn

# project glob
tools/yarn/files/yarn-*.cjs
`
  .split('\n')
  .map((line) => line.trim())
  .filter((pattern) => pattern && !pattern.startsWith('#'))

export default [...fiskerEslintConfig, {ignores}]
