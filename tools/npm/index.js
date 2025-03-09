export default {
  name: 'npm & yarn related',
  *process({
    copyFile,
    removeFile,
    installDevDependencies,
    updatePackageJson,
    LINT_SCRIPT,
    FIX_SCRIPT,
  }) {
    yield copyFile(new URL('./files/npmrc', import.meta.url), '.npmrc')
    yield copyFile(new URL('./files/yarnrc', import.meta.url), '.yarnrc')
  },
}
