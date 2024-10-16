import { execa } from '@modern-js/codesmith-utils/execa';

export async function getNpmRegistry() {
  const { stdout } = await execa('npm', ['config', 'get', 'registry']);
  return stdout.replace(/\/$/, '') || 'https://registry.npmjs.org';
}
