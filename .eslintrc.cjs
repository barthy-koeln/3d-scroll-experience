/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: [
        '.vue'
    ],
    project: [
        './tsconfig.json'
    ]
  },

  extends: [
    "standard",
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
  ],

  rules: {
    // General rules
    // Enforce placing object properties on separate lines
    'object-property-newline': 'error',
    // Enforce consistent line breaks after opening and before closing braces
    'object-curly-newline': [
      'error',
      {
        'multiline': true,
        'consistent': true
      }
    ]
  },

  overrides: [
    {
      files: [
        '*.vue'
      ],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      },
      rules: {
        indent: 'off',
        // Uncategorized Vue.js rules
        // Enforce consistent indentation in <script>
        'vue/script-indent': [
          'error',
          2,
          {
            'baseIndent': 1,
            'switchCase': 1,
            'ignores': []
          }
        ],
        // require the registered component name to match the imported component name
        'vue/match-component-import-name': 'error',
        // require component name property to match its file name
        'vue/match-component-file-name': 'error',
        // enforce line breaks after opening and before closing block-level tags
        'vue/block-tag-newline': 'error',
        // Disallow static inline style attributes
        'vue/no-static-inline-styles': [
          'error',
          {
            'allowBinding': true
          }
        ],
        // Disallow use other than available lang
        'vue/block-lang': [
          'error',
          {
            'script': {
              'lang': 'ts'
            }
          }
        ],
        // Enforce specific casing for the component naming style in template
        'vue/component-name-in-template-casing': [
          'error',
          'PascalCase',
          {
            'registeredComponentsOnly': false,
            'ignores': []
          }
        ],
        // Enforce new lines between multi-line properties in Vue components
        'vue/new-line-between-multi-line-property': [
          'error',
          {
            'minLineOfMultilineProperty': 2
          }
        ],
        // Require or disallow newlines between sibling tags in template
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
        // Require or disallow padding lines between blocks
        'vue/padding-line-between-blocks': [
          'error',
          'always'
        ],
        // Enforce static class names order
        'vue/static-class-names-order': [
            'error'
        ]
      }
    }
  ]
}
