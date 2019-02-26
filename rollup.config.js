/* eslint-disable import/no-extraneous-dependencies */

import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
// import shebang from 'rollup-plugin-shebang'
// import {terser} from 'rollup-plugin-terser'
import prettier from 'rollup-plugin-prettier'
import pkg from './package.json'

const external = Object.keys(pkg.dependencies).concat(['path', 'fs'])
const plugins = [json(), nodeResolve(), commonjs({}), prettier()]
const FORMAT_CJS = 'cjs'

export default [
  // cli
  {
    input: 'src/index.js',
    output: {
      file: 'lib/index.js',
      format: FORMAT_CJS,
    },
    plugins,
    external,
  },
  // cli
  {
    input: 'src/cli.js',
    output: {
      file: 'bin/cli',
      format: FORMAT_CJS,
      banner: '#!/usr/bin/env node\n',
    },
    plugins: [...plugins],
    external,
  },
]
