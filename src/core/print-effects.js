/* eslint-disable no-console */

import chalk from 'chalk'

function mergeEffectsByKey(tools, key) {
  return tools.reduce((all, {effects}) => all.concat(effects[key]), [])
}

function sortBy(key) {
  return (l, r) => (l[key] > r[key] ? 1 : -1)
}

function notEqualFilter({equal}) {
  return !equal
}

function printEffects(tools) {
  const files = mergeEffectsByKey(tools, 'files').sort(sortBy('dest'))
  const dependencies = mergeEffectsByKey(tools, 'dependencies').sort(
    sortBy('name')
  )
  const pkgs = mergeEffectsByKey(tools, 'package')
    .filter(notEqualFilter)
    .sort(sortBy('key'))

  if (files.length !== 0) {
    console.log(
      chalk.yellowBright(
        `effect ${files.length} file${files.length > 1 ? 's' : ''}`
      )
    )
    for (const {sourceRelative, destRelative, exists} of files) {
      console.log(
        ` - ${destRelative}${exists ? chalk.red(' (overwrite)') : ''}`
      )
      // console.log(`    from ${chalk.gray(sourceRelative)}`)
    }
    console.log('')
  }

  if (dependencies.length !== 0) {
    console.log(
      chalk.yellowBright(
        `add ${dependencies.length} ${
          files.length > 1 ? 'dependencies' : 'dependency'
        } to package.json`
      )
    )
    for (const {name, version, type, exists} of dependencies) {
      console.log(` - ${name}${exists ? chalk.red(' (overwrite)') : ''}`)
    }
    console.log('')
  }

  if (pkgs.length !== 0) {
    console.log(
      chalk.yellowBright(
        `add ${pkgs.length} value${pkgs.length > 1 ? 's' : ''} to package.json`
      )
    )
    for (const {key, segments, orignal, value, exists, equal} of pkgs) {
      console.log(
        ` - ${segments.join('.')}${exists ? chalk.red(' (overwrite)') : ''}`
      )

      if (!equal) {
        if (orignal) {
          console.log(`    from: ${chalk.gray(JSON.stringify(orignal))}`)
          console.log(`      to: ${chalk.gray(JSON.stringify(orignal))}`)
        } else {
          console.log(`    ${chalk.gray(JSON.stringify(orignal))}`)
        }
      }
    }
    console.log('')
  }

  return {
    files,
    dependencies,
    package: pkgs,
  }
}

export default printEffects
