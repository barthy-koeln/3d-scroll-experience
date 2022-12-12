/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,

  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],

  parserOptions: {
    ecmaVersion: 'latest'
  },

  rules: {
    'object-property-newline': 'error',
    'object-curly-newline': [
      'error',
      {
        'multiline': true,
        'consistent': true
      }
    ],
    'vue/script-indent': [
      'error',
      2,
      {
        'baseIndent': 1,
        'switchCase': 1,
        'ignores': []
      }
    ],
    'vue/match-component-import-name': 'error',
    'vue/match-component-file-name': 'error',
    'vue/block-tag-newline': 'error',
    'vue/no-static-inline-styles': [
      'error',
      {
        'allowBinding': true
      }
    ],
    'vue/block-lang': [
      'error',
      {
        'script': {
          'lang': 'ts'
        }
      }
    ],
    'vue/prop-name-casing': [
      'error',
      'camelCase'
    ],
    'vue/attribute-hyphenation': [
      'error',
      'always',
      {
        'ignore': []
      }
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        'registeredComponentsOnly': false,
        'ignores': []
      }
    ],
    'vue/new-line-between-multi-line-property': [
      'error',
      {
        'minLineOfMultilineProperty': 2
      }
    ],
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        'startTag': 'never',
        'endTag': 'never',
        'selfClosingTag': 'never'
      }
    ],
    'vue/padding-line-between-tags': [
      'error',
      [
        {
          'blankLine': 'always',
          'prev': '*',
          'next': '*'
        }
      ]
    ],
    'vue/padding-line-between-blocks': [
      'error',
      'always'
    ]
  }
}
