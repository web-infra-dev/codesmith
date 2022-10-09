import { Question, Schema, transformForm } from '../src/transform';

function removeValidate(questions: Question[]) {
  return questions.map(question => {
    const { validate, ...extra } = question as any;
    return extra;
  });
}
describe('transform form', () => {
  it('input', () => {
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
    const questions = transformForm(schema);
    expect(removeValidate(questions)).toEqual([
      {
        type: 'input',
        name: 'language',
        message: '开发语言',
        default: 'ts',
        origin: {},
      },
    ]);
  });
  it('select', () => {
    const schema: Schema = {
      type: 'object',
      properties: {
        language: {
          type: 'string',
          title: '开发语言',
          default: 'ts',
          enum: [
            { label: 'TS', value: 'ts' },
            { label: 'ES6+', value: 'js' },
          ],
        },
      },
    };
    const questions = transformForm(schema);

    expect(removeValidate(questions)).toEqual([
      {
        type: 'list',
        name: 'language',
        message: '开发语言',
        default: 'ts',
        choices: [
          {
            type: 'choice',
            name: 'TS',
            value: 'ts',
          },
          {
            type: 'choice',
            name: 'ES6+',
            value: 'js',
          },
        ],
        origin: {},
      },
    ]);
  });
});
