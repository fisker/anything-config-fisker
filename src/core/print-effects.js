import colors from 'ansi-colors'

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
  const pkg = mergeEffectsByKey(tools, 'pkg')
    .filter(notEqualFilter)
    .sort(sortBy('key'))

  if (files.length !== 0) {
    console.log(
      colors.yellowBright(`${files.length} file${files.length > 1 ? 's' : ''}`)
    )
    for (const {sourceRelative, destRelative, exists} of files) {
      console.log(
        ` - ${destRelative}${exists ? colors.red(' (overwrite)') : ''}`
      )
      // console.log(`    from ${colors.gray(sourceRelative)}`)
    }
    console.log('')
  }

  if (dependencies.length !== 0) {
    console.log(
      colors.yellowBright(
        `${dependencies.length} ${
          files.length > 1 ? 'dependencies' : 'dependency'
        } add to package.json`
      )
    )
    for (const {name, version, type, exists} of dependencies) {
      console.log(` - ${name}${exists ? colors.red(' (overwrite)') : ''}`)
    }
    console.log('')
  }

  if (pkg.length !== 0) {
    console.log(
      colors.yellowBright(
        `${pkg.length} change${pkg.length > 1 ? 's' : ''} in package.json`
      )
    )
    for (const {key, segments, original, value, exists, equal} of pkg) {
      console.log(
        ` - ${segments.join('.')}${exists ? colors.red(' (overwrite)') : ''}`
      )

      if (!equal) {
        if (original) {
          console.log(`    from: ${colors.gray(JSON.stringify(original))}`)
          console.log(`      to: ${colors.gray(JSON.stringify(original))}`)
        } else {
          console.log(`    ${colors.gray(JSON.stringify(original))}`)
        }
      }
    }
    console.log('')
  }

  return {
    files,
    dependencies,
    pkg,
  }
}

export default printEffects
