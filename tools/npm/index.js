export default {
  name: 'npm & yarn related',
  *process({copyFile}) {
    yield copyFile(new URL('./files/npmrc', import.meta.url), '.npmrc')
    yield copyFile(new URL('./files/yarnrc', import.meta.url), '.yarnrc')
  },
}
