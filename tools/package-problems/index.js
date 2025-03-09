export default {
  name: 'NPM & GitHub Problems',
  *process({
    copyFile,
    installDevDependencies: installDevelopmentDependencies,
    updatePackageJson,
    packageJson,
  }) {
    yield copyFile(new URL('./files/license.txt', import.meta.url), 'license')
    yield installDevelopmentDependencies(['npm-run-all2', 'del-cli'])
    yield updatePackageJson({
      license: 'MIT',
      author: {
        name: 'fisker Cheung',
        email: 'lionkay@gmail.com',
        url: 'https://www.fiskercheung.com/',
      },
      publishConfig: {
        registry: 'https://registry.npmjs.org/',
        access: 'public',
      },
      scripts: {
        dist: 'run-p "dist:*"',
        'dist:npm': 'np --yolo --no-yarn',
        clean: 'run-p "clean:*"',
        'clean:dist': 'del-cli dist',
      },
      sideEffects: false,
      homepage: `https://github.com/fisker/${packageJson.name}#readme`,
      bugs: {
        url: `https://github.com/fisker/${packageJson.name}/issues`,
      },
      repository: `fisker/${packageJson.name}`,
      funding: `https://github.com/fisker/${packageJson.name}?sponsor=1`,
      devDependencies: {
        'npm-run-all': undefined,
      },
    })
  },
}
