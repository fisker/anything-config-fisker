export default {
  name: 'git related',
  *process({copyFile}) {
    yield copyFile(new URL('./files/git-ignore', '.git-ignore'))
    yield copyFile(new URL('./files/git-attributes', '.gitattributes'))
  },
}
