<% if (compat) { %>
const {
  babelCompatSupport,
  templateCompatSupport,
} = require('@embroider/compat/babel');
<% } else { %>
const { buildMacros } = require('@embroider/macros/babel');

const macros = buildMacros();
<% } %>

module.exports = {
  plugins: [
    [
      'babel-plugin-ember-template-compilation',
      {
        compilerPath: 'ember-source/dist/ember-template-compiler.js',
        enableLegacyModules: [
          'ember-cli-htmlbars',
          'ember-cli-htmlbars-inline-precompile',
          'htmlbars-inline-precompile',
        ],<% if (compat) { %>
        transforms: [...templateCompatSupport()],<% } else { %>
        transforms: [...macros.templateMacros],<% } %>
      },
    ],
    [
      'module:decorator-transforms',
      {
        runtime: {
          import: require.resolve('decorator-transforms/runtime-esm'),
        },
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: __dirname,
        useESModules: true,
        regenerator: false,
      },
    ],<% if (compat) { %>
    ...babelCompatSupport(),<% } else { %>
    ...macros.babelMacros,<% } %>
  ],

  generatorOpts: {
    compact: false,
  },
};
