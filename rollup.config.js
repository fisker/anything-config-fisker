/* eslint-disable import/no-extraneous-dependencies */

import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import pkg from './package.json'

const external = Object.keys(pkg.dependencies).concat(['path', 'fs'])
const plugins = [json(), nodeResolve(), commonjs({})]
const FORMAT_CJS = 'cjs'

export default [
  // cli
  {
    input: 'src/index.js',
    output: {
      file: 'lib/index.js',
      format: FORMAT_CJS,
    },
    plugins: [json(), nodeResolve(), commonjs({})],
    external,
  },
  // cli
  {
    input: 'src/cli.js',
    output: {
      file: 'bin/cli',
      format: FORMAT_CJS,
    },
    banner: '#!/usr/bin/env node',
    plugins,
    external,
  },
]
