import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import eslintConfigPrettier from 'eslint-config-prettier'
import vuetify from 'eslint-config-vuetify'

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url))

export default vuetify(
  {
    perfectionist: true,
    ts: {
      tsconfigRootDir,
    },
  },
  eslintConfigPrettier,
)
