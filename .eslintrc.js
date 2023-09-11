module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:react/jsx-runtime', 'prettier', 'plugin:react/recommended'],
  ignorePatterns: ['coverage/', '*.test.tsx', '*.stories.tsx', 'testing.tsx'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        alias: {
          _assets: './src/assets',
          _atoms: './src/components/atoms',
          _components: './src/components',
          _constants: './src/constants',
          _molecules: './src/components/molecules',
          _navigations: './src/navigations',
          _organisms: './src/components/organisms',
          _scenes: './src/scenes',
          _styles: './src/styles',
          _utils: './src/utils',
          _services: './src/services',
          _templates: './src/templates',
          _hooks: './src/hooks',
          _languages: './src/i18n',
          _interfaces: './src/interfaces',
          _modules: './src/modules',
          _store: './src/store',
        },
      },
      'babel-module': {},
    },
  },
  globals: {
    JSX: 'readonly',
  },
  plugins: [
    'import',
    'react-hooks',
    'react',
    'react-native',
    '@typescript-eslint',
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-return-await': 'error',
    'no-empty-function': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/array-type': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '__tests__/**',
          '**/*.test.tsx',
          '**/*.stories.tsx',
          'storybook/**',
        ],
      },
    ],
    '@typescript-eslint/no-explicit-any': [
      'error',
      {
        ignoreRestArgs: true,
      },
    ],
    '@typescript-eslint/typedef': [
      'error',
      {
        parameter: true,
        propertyDeclaration: true,
      },
    ],
    '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
       indent: ['error', 2, { SwitchCase: 1 }],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
  },
};
