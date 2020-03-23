module.exports = {
  name: 'NPM & GitHub Problems',
  effects: {
    files: [
      {
        source: 'files/license.txt',
        destination: 'license',
      },
    ],
    dependencies: ['npm-run-all', 'del-cli'],
    packageJson: {
      license: 'MIT',
      author: {
        name: 'fisker Cheung',
        email: 'lionkay@gmail.com',
        url: 'https://www.fiskercheung.com/',
      },
      'publishConfig.registry': 'https://registry.npmjs.org/',
      'publishConfig.access': 'public',
      'scripts["dist"]': 'run-p dist:*',
      'scripts["dist:npm"]': 'np --yolo --no-yarn',
      'scripts["clean"]': 'run-p clean:*',
      'scripts["clean:dist"]': 'del-cli dist',
      sideEffects: false,
      homepage({name}) {
        return `https://github.com/fisker/${name}#readme`
      },
      'bugs.url': function ({name}) {
        return `https://github.com/fisker/${name}/issues`
      },
      repository({name}) {
        return `fisker/${name}`
      },
      funding({name}) {
        return `https://github.com/fisker/${name}?sponsor=1`
      },
    },
  },
}
