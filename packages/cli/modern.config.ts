import { defineConfig, moduleTools } from '@modern-js/module-tools';

import { testingPlugin } from '@modern-js/plugin-testing';

export default defineConfig({
  buildConfig: {
    autoExternal: false,
    dts: false,
    sideEffects: false,
  },
  plugins: [moduleTools(), testingPlugin()],
});
