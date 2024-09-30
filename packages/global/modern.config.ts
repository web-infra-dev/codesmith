import { defineConfig, moduleTools } from '@modern-js/module-tools';

export default defineConfig({
  buildConfig: {
    dts: false,
    format: 'umd',
    autoExternal: false,
    externals: ['bluebird', '@sigstore/core', '@sigstore/verify'],
  },
  plugins: [moduleTools()],
});
