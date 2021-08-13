import exists from './is-exists.js'

function isInstalled({packageJson, files, dependencies}) {
  return (
    packageJson.some((field) => exists(field)) ||
    files.some((file) => exists(file)) ||
    dependencies.some((dependency) => exists(dependency))
  )
}

export default isInstalled
