import { renderString } from '@/utils';

describe('Utils cases', () => {
  test('renderString test', () => {
    const result = renderString('renderString <%= name %>', { name: 'test' });
    expect(result).toBe('renderString test');
  });
  test('renderString array', () => {
    const people = ['geddy', 'neil', 'alex'];
    const result = renderString('<%= people.join(", "); %>', { people });
    expect(result).toBe('geddy, neil, alex');
  });
});
