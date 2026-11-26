import { defineConfig } from 'vite';
import {
  classicEmberSupport,
  defaultRolldownSharedPlugins,
  ember,
} from '@embroider/vite';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    classicEmberSupport(),
    ember({
      rolldownSharedPlugins: defaultRolldownSharedPlugins.concat(
        '@rolldown/plugin-babel',
      ),
    }),
    // extra plugins here
    await babel({
      presets: ['./babel.config.mjs'],
      include: /\.(m?[jt]s|g[jt]s|hbs)(\?|$)/,
      /**
       * Addons in node_modules need babel too,
       * for their @embroider/macros calls.
       */
      exclude: /\0rolldown\/runtime\.js/,
    }),
  ],
});
