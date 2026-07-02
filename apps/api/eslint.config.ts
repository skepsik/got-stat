import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createNodeEslintConfig } from '../../eslint.node.config';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default createNodeEslintConfig(tsconfigRootDir);
