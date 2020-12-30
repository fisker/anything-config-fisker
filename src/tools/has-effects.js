function hasEffects({files, dependencies, pkg: package_}) {
  return (
    files.length !== 0 || dependencies.length !== 0 || package_.length !== 0
  )
}

export default hasEffects
