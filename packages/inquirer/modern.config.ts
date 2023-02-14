import moduleTools, { defineConfig } from '@modern-js/module-tools';
import { nodeBuildConfig } from '@modern-js/build-config';

export default defineConfig({
  buildConfig: nodeBuildConfig,
  plugins: [moduleTools()],
});
