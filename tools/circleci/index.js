export default {
  name: 'Circleci (Uninstall)',
  *process({removeFile}) {
    yield removeFile('.circleci')
  },
}
