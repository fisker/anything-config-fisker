import exists from './is-exists'

function isInstalled({pkg: package_, files, dependencies}) {
  return (
    package_.some(exists) || files.some(exists) || dependencies.some(exists)
  )
}

export default isInstalled
