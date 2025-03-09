export default {
  name: 'Renovate',
  *process({copyFile, removeFile}) {
    yield copyFile(
      new URL('./files/config.json5', import.meta.url),
      '.github/renovate.json5',
    )
    yield removeFile('renovate.json')
  },
}
