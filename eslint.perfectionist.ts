import type { Linter } from 'eslint';

export const perfectionistRules: Linter.RulesRecord = {
  'perfectionist/sort-imports': [
    'error',
    {
      groups: [
        'type',
        ['type-parent', 'type-sibling', 'type-index', 'type-internal'],
        'builtin',
        'external',
        'internal',
        ['parent', 'sibling', 'index'],
        'side-effect',
        'unknown',
      ],
      newlinesBetween: 'ignore',
      order: 'asc',
      type: 'natural',
    },
  ],
  'perfectionist/sort-named-imports': [
    'error',
    { order: 'asc', type: 'natural' },
  ],
  'perfectionist/sort-exports': ['error', { order: 'asc', type: 'natural' }],
  'perfectionist/sort-named-exports': [
    'error',
    { order: 'asc', type: 'natural' },
  ],
};
