import exists from './is-exists'

function isInstalled({package: pkg, files, dependencies}) {
  return pkg.some(exists) || files.some(exists) || dependencies.some(exists)
}

export default isInstalled
