import { defineConfig } from 'vite';
import { extensions<% if (!noCompat) { %>, classicEmberSupport<% } %>, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

export default defineConfig({
  plugins: [<% if (!noCompat) { %>
    classicEmberSupport(),<% } %>
    ember(),
    // extra plugins here
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
});
