/* eslint-disable import/no-extraneous-dependencies */

import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'lib/index.js',
      format: 'cjs',
    },
    plugins: [json(), nodeResolve(), commonjs({})],
    external: Object.keys(pkg.dependencies).concat(['path', 'fs']),
  },
]
