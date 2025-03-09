export default {
  name: 'GitHub',
  *process({copyFile, removeFile}) {
    yield removeFile('.github/funding.yml')
    yield copyFile(
      new URL('./files/continuous-integration.yml', import.meta.url),
      '.github/workflows/continuous-integration.yml',
    )
  },
}
