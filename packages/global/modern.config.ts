import { defineConfig, moduleTools } from '@modern-js/module-tools';

export default defineConfig({
  buildConfig: {
    target: 'es2020',
    dts: false,
    format: 'umd',
    autoExternal: false,
    alias: {
      '@modern-js/utils/lodash': require.resolve(
        '@modern-js/codesmith-utils/lodash',
      ),
    },
    minify: 'terser',
  },
  plugins: [moduleTools()],
});
