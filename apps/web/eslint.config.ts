import { createConfig } from '@skepsik/eslint-config';

export default createConfig({
  ignores: ['dist/**', 'dist-ssr/**'],
  rootDir: import.meta.dirname,
});
