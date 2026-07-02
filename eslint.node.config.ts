import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'
import perfectionist from 'eslint-plugin-perfectionist'
import tseslint from 'typescript-eslint'

import { perfectionistRules } from './eslint.perfectionist'

export function createNodeEslintConfig(tsconfigRootDir: string) {
  return defineConfig(
    {
      ignores: ['dist/**', 'eslint.config.ts'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
      files: ['**/*.ts'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
      plugins: {
        perfectionist,
      },
      rules: perfectionistRules,
    },
    eslintConfigPrettier,
  )
}
