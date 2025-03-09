import fs from 'node:fs/promises'

export default {
  name: 'GitHub',
  async *process({copyFile, removeFile, writeFile, packageJson}) {
    yield removeFile('.github/funding.yml')
    yield copyFile(
      new URL(
        './files/.github/workflows/continuous-integration.yml',
        import.meta.url,
      ),
      '.github/workflows/continuous-integration.yml',
    )

    const content = await fs.readFile(
      new URL('./files/.github/workflows/automated-fix.yml', import.meta.url),
      'utf8',
    )
    yield writeFile(
      '.github/workflows/automated-fix.yml',
      content.replaceAll('<REPOSITORY>', `fisker/${packageJson.name}`),
    )
  },
}
