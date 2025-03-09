export default {
  name: 'git related',
  *process({copyFile}) {
    yield copyFile(new URL('./files/git-ignore', import.meta.url), '.gitignore')
    yield copyFile(
      new URL('./files/git-attributes', import.meta.url),
      '.gitattributes',
    )
  },
}
