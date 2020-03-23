#!/usr/bin/env node

process.on('unhandledRejection', (error) => {
  console.error(error)
  process.exit(1)
})

// eslint-disable-next-line import/no-unresolved
require('./dist/cli').run()
