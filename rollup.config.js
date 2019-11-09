import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
// import {terser} from 'rollup-plugin-terser'
import package_ from './package.json'

const external = Object.keys(package_.dependencies).concat(['path', 'fs'])
const plugins = [json(), nodeResolve(), commonjs(), babel()]

const FORMAT_CJS = 'cjs'

function rollupConfig(config = {}) {
  if (typeof config === 'string') {
    config = {
      entry: config,
    }
  }

  const {entry, dist = config.entry} = config

  return {
    input: `src/${entry}.js`,
    output: {
      file: `dist/${dist}.js`,
      format: FORMAT_CJS,
    },
    plugins,
    external,
  }
}

export default [rollupConfig('cli')]
