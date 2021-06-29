function hasEffects({files, dependencies, packageJson}) {
  return (
    files.length !== 0 || dependencies.length !== 0 || packageJson.length !== 0
  )
}

export default hasEffects
