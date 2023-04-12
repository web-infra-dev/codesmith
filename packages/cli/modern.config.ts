import moduleTools, { defineConfig } from '@modern-js/module-tools';

import testingPlugin from '@modern-js/plugin-testing';

export default defineConfig({
  buildConfig: {
    autoExternal: false,
    alias: {
      chalk: '@modern-js/utils/chalk',
    },
    dts: false,
  },
  plugins: [moduleTools(), testingPlugin()],
});
