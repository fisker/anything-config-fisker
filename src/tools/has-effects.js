function hasEffects({files, dependencies, pkg}) {
  return files.length > 0 || dependencies.length > 0 || pkg.length > 0
}

export default hasEffects
