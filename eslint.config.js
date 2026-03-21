import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist/', 'coverage/'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...pluginVue.configs['flat/recommended'],
  prettierConfig,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/multi-word-component-names': 'off',
    },
  },
)
