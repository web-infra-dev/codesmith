import ejs from 'ejs';

export function renderString(
  template: string,
  fullData: Record<string, unknown>,
): string {
  return ejs.render(template, fullData) || '';
}
