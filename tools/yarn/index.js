export default {
  name: 'Yarn',
  *process({removeFile, runCommand}) {
    yield removeFile('.yarnrc')
    yield copyFile(
      new URL('./files/yarnrc.yml', import.meta.url),
      '.yarnrc.yml',
    )
    yield runCommand('yarn', ['set', 'version', 'berry'])
  },
}
