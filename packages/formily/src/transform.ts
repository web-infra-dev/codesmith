import { Schema as FormilySchema } from '@formily/json-schema';
import { isObject, flattenDeep, isArray } from '@modern-js/utils/lodash';
import { QuestionCollection } from 'inquirer';
import { validate } from '@formily/validator';

export type Schema = Partial<
  Pick<
    FormilySchema,
    'type' | 'title' | 'default' | 'enum' | 'x-validate' | 'x-reactions'
  >
> & {
  properties?: Record<string, Schema>;
};

export type Question = QuestionCollection & { origin: Schema };

function validateSchema(schema: Schema) {
  const { type, properties } = schema;
  if (type !== 'object') {
    throw Error('schema should be `object`');
  }
  if (!properties) {
    throw Error('schema should containers `properties` field');
  }
}

export function getQuestionFromSchema(schema: Schema): Question[] {
  const { properties } = schema;

  validateSchema(schema);

  const fields = Object.keys(properties!);

  if (fields.length === 0) {
    return [];
  }

  const questions = fields.map(field => {
    const {
      type,
      title,
      default: defaultValue,
      enum: items,
      'x-validate': fieldValidate,
      ...extra
    } = properties![field];
    if (type === 'void') {
      return getQuestionFromSchema(properties![field]);
    }
    if (type !== 'string' && type !== 'number') {
      throw Error('only support string or number schema');
    }
    const questionValidate = async (input: unknown) => {
      if (!fieldValidate) {
        return true;
      }
      const result = await validate(input, fieldValidate);
      if (result.error?.length) {
        return result.error.join(';');
      }
      return true;
    };
    const result = {
      name: field,
      message: title || field,
      default: defaultValue,
      origin: extra,
      validate: questionValidate,
    };
    if (items) {
      if (isArray(defaultValue)) {
        return {
          ...result,
          type: 'checkbox',
          choices: items.map(item => ({
            type: 'choice',
            name: isObject(item) ? item.label : item,
            value: isObject(item) ? item.value : item,
          })),
        };
      }
      return {
        ...result,
        type: 'list',
        choices: items.map(item => ({
          type: 'choice',
          name: isObject(item) ? item.label : item,
          value: isObject(item) ? item.value : item,
        })),
      };
    }
    if (type === 'number') {
      return {
        ...result,
        type: 'number',
      };
    }
    return {
      ...result,
      type: 'input',
    };
  });
  return flattenDeep(questions as unknown as Question[]);
}

export function transformForm(schema: Schema): Question[] {
  return getQuestionFromSchema(schema);
}
