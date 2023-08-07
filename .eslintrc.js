module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: [
    'import',
    'react-hooks',
    'react',
    'react-native',
    '@typescript-eslint',
  ],
  ignorePatterns: ['coverage/', '__tests__/'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        alias: {
          assets: './src/assets',
          atoms: './src/components/atoms',
          components: './src/components',
          constants: './src/constants',
          molecules: './src/components/molecules',
          navigations: './src/navigations',
          organisms: './src/components/organisms',
          scenes: './src/scenes',
          styles: './src/styles',
          utils: './src/utils',
          services: './src/services',
          templates: './src/templates',
          hooks: './src/hooks',
          languages: './src/i18n',
          interfaces: './src/interfaces',
          modules: './src/modules',
          store: './src/store',
        },
      },
      'babel-module': {},
    },
  },
  rules: {
    semi: ['error', 'never'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['__tests__/**'],
      },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
}
