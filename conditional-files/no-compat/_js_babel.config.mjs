import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
<% if (warpDrive) { %>import { setConfig } from '@warp-drive/core/build-config';
<% } %>import { buildMacros } from '@embroider/macros/babel';

<% if (warpDrive) { %>const macros = buildMacros({
  configure: (config) => {
    setConfig(config, {
      // for universal apps this MUST be at least 5.6
      compatWith: '5.6',
    });
  },
});
<% } else { %>const macros = buildMacros();
<% } %>
export default {
  plugins: [
    [
      'babel-plugin-ember-template-compilation',
      {
        compilerPath: 'ember-source/dist/ember-template-compiler.js',
        transforms: [...macros.templateMacros],
      },
    ],
    [
      'module:decorator-transforms',
      {
        runtime: {
          import: import.meta.resolve('decorator-transforms/runtime-esm'),
        },
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: dirname(fileURLToPath(import.meta.url)),
        useESModules: true,
        regenerator: false,
      },
    ],
    ...macros.babelMacros,
  ],

  generatorOpts: {
    compact: false,
  },
};
