#!/usr/bin/env node

const execa = require('execa')
const hasYarn = require('has-yarn')()
const {install} = require('../lib')

install().then(
  () => {
    if (hasYarn) {
      return execa('yarn')
    }

    return execa('npm', ['install'])
  },
  // eslint-disable-next-line no-console
  error => console.error(error)
)
