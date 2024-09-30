import { defineConfig, moduleTools } from '@modern-js/module-tools';

export default defineConfig({
  buildConfig: {
    target: 'es2020',
    dts: false,
    format: 'umd',
    autoExternal: false,
  },
  plugins: [moduleTools()],
});
