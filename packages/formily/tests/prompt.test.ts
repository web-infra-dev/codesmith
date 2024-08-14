import { prompt } from '../src/prompt';
import type { Schema } from '../src/transform';

describe('prompt test', () => {
  it('has config value', async () => {
    const schema: Schema = {
      type: 'object',
      properties: {
        language: {
          type: 'string',
          title: '开发语言',
          default: 'ts',
        },
      },
    };
    const ans = await prompt(schema, { language: 'ts' }, {}, {});
    expect(ans).toEqual({ language: 'ts' });
  });
});
