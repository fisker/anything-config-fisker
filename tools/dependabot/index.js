export default {
  name: 'Dependabot (Uninstall)',
  *process({removeFile}) {
    yield removeFile(['.dependabot', '.github/dependabot.yml'])
  },
}
