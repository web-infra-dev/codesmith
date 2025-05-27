import { execa } from '@modern-js/codesmith-utils/execa';

export async function getNpmRegistry() {
  try {
    const { stdout } = await execa('npm', [
      'config',
      'get',
      'registry',
      '--no-workspaces',
    ]);
    return stdout.replace(/\/$/, '') || 'https://registry.npmjs.org';
  } catch (error) {
    // If getting registry fails, return default npm registry
    return 'https://registry.npmjs.org';
  }
}
