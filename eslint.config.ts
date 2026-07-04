import { createConfig } from '@skepsik/eslint-config';

export default createConfig({
  ignores: ['apps/api/src/db/migrations/**'],
  rootDir: import.meta.dirname,
  typescript: {
    projectService: {
      allowDefaultProject: ['eslint.config.ts', 'prettier.config.ts'],
      typeChecked: true,
    },
  },
});
