import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  // For .js files, treat them as ES modules
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module', // ES module source type
    },
  },

  // Define browser globals like `document`, `alert()`, etc.
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Add browser globals (document, alert, etc.)
        // You can also add any other custom globals if needed
      },
    },
  },

  // ESLint recommended JS rules
  pluginJs.configs.recommended,
];
