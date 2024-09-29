/* eslint-disable @typescript-eslint/naming-convention */
import type { Schema as FormilySchema } from '@formily/json-schema';
import { type Validator, validate } from '@formily/validator';
import {
  flattenDeep,
  isFunction,
  isObject,
} from '@modern-js/codesmith-utils/lodash';
import type { Question as InquirerQuestion } from 'inquirer';

export type Schema = Partial<
  Pick<
    FormilySchema,
    'type' | 'title' | 'default' | 'enum' | 'x-validator' | 'x-reactions'
  >
> & {
  properties?: Record<string, Schema>;
  'x-validate'?: Validator; // fix typo error
};

export type Question = InquirerQuestion & { origin: Schema };

function validateSchema(schema: Schema) {
  const { type, properties } = schema;
  if (type !== 'object') {
    throw Error('schema should be `object`');
  }
  if (!properties) {
    throw Error('schema should containers `properties` field');
  }
}

export function getQuestionFromSchema(
  schema: Schema,
  configValue: Record<string, unknown> = {},
  validateMap: Record<
    string,
    (
      input: unknown,
      data?: Record<string, unknown>,
    ) => { success: boolean; error?: string }
  >,
  initValue: Record<string, unknown>,
): Question[] {
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
      'x-validator': _fieldValidate_1,
      'x-validate': _fieldValidate_2,
      ...extra
    } = properties![field];
    const fieldValidate = _fieldValidate_1 || _fieldValidate_2;
    if (type === 'void' || type === 'object') {
      return getQuestionFromSchema(
        properties![field],
        configValue,
        validateMap,
        initValue,
      );
    }
    if (type !== 'string' && type !== 'number') {
      throw Error('only support string or number schema');
    }
    const questionValidate = async (field: string, input: unknown) => {
      if (fieldValidate) {
        const result = await validate(
          input,
          isFunction(fieldValidate)
            ? { validator: fieldValidate }
            : fieldValidate,
        );
        if (result.error?.length) {
          return result.error.join(';');
        }
      }
      if (validateMap[field]) {
        const result = validateMap[field](input, configValue);
        if (result.error) {
          return result.error;
        }
      }
      return true;
    };
    const result = {
      name: field,
      message: title || field,
      default: initValue[field] || defaultValue,
      origin: extra,
      validate: (input: unknown) => questionValidate(field, input),
      when: !configValue[field],
    };
    if (items) {
      if (Array.isArray(defaultValue)) {
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

export function transformForm(
  schema: Schema,
  configValue: Record<string, unknown> = {},
  validateMap: Record<
    string,
    (
      input: unknown,
      data?: Record<string, unknown>,
    ) => { success: boolean; error?: string }
  >,
  initValue: Record<string, unknown>,
): Question[] {
  return getQuestionFromSchema(schema, configValue, validateMap, initValue);
}
/* eslint-enable @typescript-eslint/naming-convention */
