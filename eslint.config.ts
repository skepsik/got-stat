import { createConfig } from '@skepsik/eslint-config';

export default createConfig({
  ignores: ['apps/api/src/db/migrations/**'],
  rootDir: import.meta.dirname,
  typed: {
    allowDefaultProject: ['eslint.config.ts', 'prettier.config.ts'],
  },
});
