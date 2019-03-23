module.exports = {
  name: 'NPM & GitHub Problems',
  effects: {
    files: ['license'],
    dependencies: [],
    'package.json': [
      {
        key: 'license',
        value: 'MIT',
      },
      {
        key: 'author',
        value: {
          name: 'fisker',
          email: 'lionkay@gmail.com',
          url: 'https://www.fiskercheung.com/',
        },
      },
      {
        key: 'publishConfig.registry',
        value: 'https://registry.npmjs.org/',
      },
    ],
  },
}
