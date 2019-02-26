import {existsSync} from 'fs'
import isDependencyAdded from './is-dependency-added'
import pkg from './pkg'
import hasOwn from './has-own'

function isToolInstalled(tool) {
  const {files, dependencies, pkg: json} = tool

  if (files.some(({target}) => existsSync(target))) {
    return 'maybe'
  }

  if (dependencies.some(isDependencyAdded)) {
    return 'maybe'
  }

  if (Object.keys(json).some(key => hasOwn.call(pkg, key))) {
    return 'maybe'
  }

  return false
}

export default isToolInstalled
