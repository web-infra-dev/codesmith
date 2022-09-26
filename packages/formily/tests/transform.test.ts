import { Schema, transformForm } from '../src/transform';

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
    expect(questions).toEqual([
      {
        type: 'input',
        name: 'language',
        message: '开发语言',
        default: 'ts',
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
    expect(questions).toEqual([
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
      },
    ]);
  });
  it('reaction', () => {
    const schema: Schema = {
      type: 'object',
      properties: {
        needModifyMWAConfig: {
          type: 'string',
          title: '是否需要修改应用默认配置',
          default: 'no',
          enum: [
            { label: '否', value: 'no' },
            { label: '是', value: 'yes' },
          ],
          'x-reactions': [
            {
              target: 'clientRoute',
              fulfill: {
                state: {
                  visible: "{{$self.value=='yes'}}",
                },
              },
            },
          ],
        },
        clientRoute: {
          type: 'string',
          title: '客户端路由配置',
          default: 'selfControlRoute',
          enum: [
            { label: '启用自控路由', value: 'selfControlRoute' },
            { label: '启用约定式路由', value: 'conventionalRoute' },
          ],
        },
      },
    };
    const questions = transformForm(schema);
    expect(questions).toEqual([
      {
        type: 'list',
        name: 'needModifyMWAConfig',
        message: '是否需要修改应用默认配置',
        default: 'no',
        choices: [
          {
            type: 'choice',
            name: '否',
            value: 'no',
          },
          {
            type: 'choice',
            name: '是',
            value: 'yes',
          },
        ],
      },
      {
        type: 'list',
        name: 'selfControlRoute',
        message: '客户端路由配置',
        default: 'selfControlRoute',
        choices: [
          {
            type: 'choice',
            name: '启用自控路由',
            value: 'selfControlRoute',
          },
          {
            type: 'choice',
            name: '启用约定式路由',
            value: 'conventionalRoute',
          },
        ],
        when: (answers: Record<string, any>) => {
          return answers.needModifyMWAConfig === 'yes';
        },
      },
    ]);
  });
});
