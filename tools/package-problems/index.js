module.exports = {
  name: 'NPM & GitHub Problems',
  effects: {
    files: ['license'],
    dependencies: [],
    'package.json': {
      license: 'MIT',
      author: {
        name: 'fisker Cheung',
        email: 'lionkay@gmail.com',
        url: 'https://www.fiskercheung.com/',
      },
      'publishConfig.registry': 'https://registry.npmjs.org/',
      'publishConfig.access': 'public',
      'scripts["dist:npm"]': 'np --yolo --no-yarn',
      sideEffects: false,
    },
  },
}
