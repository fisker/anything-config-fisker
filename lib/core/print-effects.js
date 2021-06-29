import colors from 'ansi-colors'

function mergeEffectsByKey(tools, key) {
  return tools.reduce((all, {effects}) => [...all, ...effects[key]], [])
}

function sortBy(key) {
  return (l, r) => (l[key] > r[key] ? 1 : -1)
}

function notEqualFilter({equal}) {
  return !equal
}

function printEffects(tools) {
  const files = mergeEffectsByKey(tools, 'files').sort(sortBy('destination'))
  const dependencies = mergeEffectsByKey(tools, 'dependencies').sort(
    sortBy('name')
  )
  const packageJson = mergeEffectsByKey(tools, 'packageJson')
    .filter(notEqualFilter)
    .sort(sortBy('key'))

  if (files.length !== 0) {
    console.log(
      colors.yellowBright(`${files.length} file${files.length > 1 ? 's' : ''}`)
    )
    for (const {sourceRelative, destinationRelative, exists} of files) {
      let effect = ''
      if (sourceRelative) {
        if (exists) {
          effect = 'overwrite'
        }
      } else {
        effect = 'delete'
      }
      console.log(
        ` - ${destinationRelative}${effect ? colors.red(` (${effect})`) : ''}`
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

  if (packageJson.length !== 0) {
    console.log(
      colors.yellowBright(
        `${packageJson.length} change${
          packageJson.length > 1 ? 's' : ''
        } in package.json`
      )
    )
    for (const {key, segments, original, value, exists, equal} of packageJson) {
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
    packageJson,
  }
}

export default printEffects
