import process from 'node:process'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import url from 'node:url'
import path from 'node:path'
import latestVersion from 'latest-version'
import spawn from 'nano-spawn'

const CWD = url.pathToFileURL(process.cwd())
const BACKUP_DIRECTORY = new URL('./.removed/', CWD)
const PACKAGE_JSON_FILE = new URL('./package.json', CWD)
const LINT_SCRIPT = 'run-p --continue-on-error "lint:*"'
const Fix_SCRIPT = 'run-p --continue-on-error "fix:*"'

const toUrl = (file) => {
  if (file instanceof URL) {
    return file
  }

  if (path.isAbsolute(file)) {
    return url.pathToFileURL(file)
  }

  return path.resolve(file)
}

const isJsonObject = (value) =>
  value && !Array.isArray(value) && typeof value === 'object'

async function backupFile(file) {
  let stats
  try {
    stats = await fs.stats(file)
  } catch (error) {
    if (error.code === 'ENFILE') {
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

  for (const file of fileOrFiles) {
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
  try {
    const text = fsSync.readFileSync(PACKAGE_JSON_FILE)
    return {
      text,
      value: JSON.parse(text),
    }
  } catch {}

  return {text: undefined, value: {}}
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
  const {text: original, value} = getPackageJson()

  const packageJson = setValue(value, data)
  const text = JSON.stringify(packageJson)

  if (original === 'text') {
    return
  }

  await fs.write(PACKAGE_JSON_FILE, text)
}

async function installDevelopmentDependencies(dependencyOrDependencies) {
  const dependencies = Array.isArray(dependencyOrDependencies)
    ? dependencyOrDependencies
    : [dependencyOrDependencies]

  const value = Object.fromEntries(
    await Promise.all(
      dependencies.map(async (dependency) => [
        dependency,
        await latestVersion(name),
      ]),
    ),
  )

  await updatePackageJson({
    devDependencies: value,
  })
}

const context = {
  LINT_SCRIPT,
  FIX_SCRIPT,
  removeFile,
  copyFile,
  updatePackageJson,
  installDevDependencies: installDevelopmentDependencies,
  get packageJson() {
    return getPackageJson()
  },
  runCommand: spawn,
}

export default context
