import moduleTools, { defineConfig } from '@modern-js/module-tools';
import testPlugin from '@modern-js/plugin-testing';
import { nodeBuildConfig } from '@modern-js/build-config';

export default defineConfig({
  buildConfig: nodeBuildConfig,
  plugins: [moduleTools(), testPlugin()],
});
