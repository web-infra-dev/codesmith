import { moduleTools, defineConfig } from '@modern-js/module-tools';

import { testingPlugin } from '@modern-js/plugin-testing';

export default defineConfig({
  buildPreset: 'modern-js-universal',
  plugins: [moduleTools(), testingPlugin()],
});
