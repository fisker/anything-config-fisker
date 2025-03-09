export default {
  name: 'VSCode',
  *process({copyFile}) {
    yield copyFile(
      new URL('./files/extensions.jsonc', import.meta.url),
      '.vscode/extensions.json',
    )
    yield copyFile(
      new URL('./files/settings.example.jsonc', import.meta.url),
      '.vscode/settings.json',
    )
    yield copyFile(
      new URL('./files/settings.example.jsonc', import.meta.url),
      '.vscode/extensions.example.json',
    )
  },
}
