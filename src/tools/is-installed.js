import exists from './is-exists'

function isInstalled({pkg, files, dependencies}) {
  return pkg.some(exists) || files.some(exists) || dependencies.some(exists)
}

export default isInstalled
