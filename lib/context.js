import fsSync from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import url from 'node:url'
import latestVersion from 'latest-version'
import spawn from 'nano-spawn'

const CWD = url.pathToFileURL(`${process.cwd()}/`)
const BACKUP_DIRECTORY = new URL('./.deleted/', CWD)
const PACKAGE_JSON_FILE = new URL('./package.json', CWD)
console.log({PACKAGE_JSON_FILE})
const LINT_SCRIPT = 'run-p --continue-on-error "lint:*"'
const FIX_SCRIPT = 'run-p --continue-on-error "fix:*"'

const toUrl = (file) => {
  if (file instanceof URL) {
    return file
  }

  return url.pathToFileURL(path.isAbsolute(file) ? file : path.resolve(file))
}

const isJsonObject = (value) =>
  value && !Array.isArray(value) && typeof value === 'object'

async function backupFile(file) {
  try {
    await fs.stat(file)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return
    }

    throw error
  }

  const name = file.href.split('/').pop()
  await fs.cp(file, new URL(`./${name}.${Date.now()}`, BACKUP_DIRECTORY))
}

async function removeFile(fileOrFiles) {
  const files = (Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles]).map(
    (file) => toUrl(file),
  )

  for (const file of files) {
    await backupFile(file)
    await fs.rm(file, {recursive: true, force: true})
  }
}

async function copyFile(from, to) {
  if (!(from instanceof URL)) {
    throw new TypeError("Expected 'from' to be an 'URL'")
  }

  to = toUrl(to)

  await backupFile(to)
  await fs.cp(from, to)
}

function getPackageJson() {
  return JSON.parse(fsSync.readFileSync(PACKAGE_JSON_FILE))
}

function setValue(object, key, value) {
  if (!isJsonObject(object)) {
    object = {}
  }

  if (value === 'undefined') {
    delete object[key]
    return object
  }

  if (!isJsonObject(value)) {
    object[key] = value
    return object
  }

  const child = object[key]

  for (const [childKey, childValue] of Object.entries(value)) {
    setValue(child, childKey, childValue)
  }

  if (Object.keys(child).length === 0) {
    delete object[key]
    return object
  }

  object[key] = child
  return object
}

async function updatePackageJson(data) {
  const original = getPackageJson()

  const updated = structuredClone(original)
  for (const [key, value] of Object.entries(data)) {
    setValue(updated, key, value)
  }

  if (JSON.stringify(original) === JSON.stringify(updated)) {
    return
  }

  await fs.writeFile(
    PACKAGE_JSON_FILE,
    `${JSON.stringify(updated, undefined, 2)}\n`,
  )
}

async function installDevelopmentDependencies(dependencyOrDependencies) {
  const dependencies = Array.isArray(dependencyOrDependencies)
    ? dependencyOrDependencies
    : [dependencyOrDependencies]

  const value = Object.fromEntries(
    await Promise.all(
      dependencies.map(async (dependency) => [
        dependency,
        await latestVersion(dependency),
      ]),
    ),
  )

  await updatePackageJson({
    devDependencies: value,
  })
}

async function writeFile(file, content) {
  file = toUrl(file)

  const directory = new URL('./', file)
  await fs.mkdir(directory, {recursive: true})
  await fs.writeFile(file, content)
}

const context = {
  LINT_SCRIPT,
  FIX_SCRIPT,
  removeFile,
  copyFile,
  writeFile,
  updatePackageJson,
  installDevDependencies: installDevelopmentDependencies,
  get packageJson() {
    return getPackageJson()
  },
  runCommand(file, arguments_, options) {
    return spawn(file, arguments_, {stdio: 'inherit', options})
  },
}

export default context
