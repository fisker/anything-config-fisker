import {join} from 'path'
import writePkg from 'write-pkg'
import execa from 'execa'
import hasYarn from 'has-yarn'
import hasOwn from './utils/has-own'
import tools from './utils/tools'
import pkg from './utils/pkg'
import copyFiles from './utils/copy-files'
import parseDependencies from './utils/parse-dependencies'
import {TOOLS_DIR, CWD} from './constants'

const HAS_YARN = hasYarn()
const NPM_CLIENT = HAS_YARN ? 'yarn' : 'npm'

setup().then(
  () => execa(NPM_CLIENT, ['install']),
  // eslint-disable-next-line no-console
  error => console.error(error)
)

async function merge(tools) {
  const files = tools.reduce(
    (all, {name, files = []}) =>
      all.concat(
        files.map(file => ({
          source: join(TOOLS_DIR, name, file),
          target: join(CWD, file),
        }))
      ),
    []
  )

  const dependencies = await parseDependencies(
    tools
      .reduce((all, {dependencies = []}) => all.concat(dependencies), [])
      .filter(
        dependency =>
          !hasOwn.call(pkg.devDependencies, dependency) &&
          !hasOwn.call(pkg.devDependencies, dependency)
      )
      .sort()
  )

  const json = tools.reduce(
    (all, {package: pkg = {}}) => Object.assign(all, pkg),
    {}
  )

  return {
    files,
    dependencies,
    json,
  }
}

async function setup() {
  const {files, dependencies, json} = await merge(tools)

  await copyFiles(files)

  pkg.devDependencies = Object.assign(dependencies, pkg.devDependencies)
  Object.assign(pkg, json)

  // eslint-disable-next-line no-underscore-dangle
  delete pkg._id

  await writePkg(pkg)
}

export default {run: setup}
