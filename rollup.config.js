/* eslint-disable import/no-extraneous-dependencies */

import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
// import shebang from 'rollup-plugin-shebang'
// import {terser} from 'rollup-plugin-terser'
import prettier from 'rollup-plugin-prettier'
import pkg from './package.json'

const prettierConfig = {
  ...require('./prettier.config'),
  parser: 'babel',
}

const external = Object.keys(pkg.dependencies).concat(['path', 'fs'])
const plugins = [json(), nodeResolve(), commonjs({}), prettier(prettierConfig)]
const FORMAT_CJS = 'cjs'

function rollupConfig(config = {}) {
  if (typeof config === 'string') {
    config = {
      entry: config,
    }
  }

  const {entry, dist = config.entry, cli} = config

  return {
    input: `src/${entry}.js`,
    output: {
      file: `${cli ? 'bin' : 'lib'}/${dist}.js`,
      format: FORMAT_CJS,
      banner: cli ? '#!/usr/bin/env node\n' : '',
    },
    plugins,
    external,
  }
}

export default [
  // default
  rollupConfig('index'),
  // cli
  rollupConfig({
    entry: 'cli',
    cli: true,
  }),
]
