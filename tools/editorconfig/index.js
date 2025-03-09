export default {
  name: 'EditorConfig',
  *process({copyFile}) {
    yield copyFile(
      new URL('./files/config.ini', import.meta.url),
      '.editorconfig',
    )
  },
}
