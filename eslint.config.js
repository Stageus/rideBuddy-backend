import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';

export default [
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {globals: globals.browser},
    plugins: {eslintPluginImport},
    ignores: ['node_modules/*', '.prettierrc', 'eslint.config.js', 'package-lock.json', 'package.json'],
    rules: {
      'prettier/prettier': [
        'error',
        {
          printWidth: 150,
          trailingComma: 'none',
          bracketSpacing: false, // 배열 내 공백 제거
          arrayBracketNewline: 'never', // 배열 줄 바꿈 비활성화
          bracketSameLine: true
        }
      ],
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-useless-escape': 'off'
    }
  }
];
