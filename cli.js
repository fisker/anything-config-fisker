#!/usr/bin/env node

process.on('unhandledRejection', () => process.exit(1))

require('./lib/cli').run()
