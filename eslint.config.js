import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';

export default [
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: { globals: globals.browser },
    plugins: { eslintPluginImport },
    ignores: [
      'node_modules/*',
      '.prettierrc',
      'eslint.config.js',
      'package-lock.json',
      'package.json',
    ],
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
];
