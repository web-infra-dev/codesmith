import { Schema as FormilySchema } from '@formily/json-schema';
import { isObject } from '@modern-js/utils/lodash';
import { Question } from 'inquirer';
import { isFunction } from 'lodash';

export type Schema = Pick<
  FormilySchema,
  'type' | 'title' | 'default' | 'enum' | 'x-reactions'
> & {
  properties?: Record<string, Schema>;
  'x-visible': boolean | ((extra: Record<string, any>) => boolean);
};

function validateSchema(schema: Schema) {
  const { type, properties } = schema;
  if (type !== 'object') {
    throw Error('schema type should be `object`');
  }
  if (!properties) {
    throw Error('schema should containers `properties` field');
  }
}

export function getFormSchemaWithExtra(
  schema: Schema,
  extra: Record<string, any>,
) {
  const { properties } = schema;

  validateSchema(schema);

  const fields = Object.keys(properties!);

  return fields.map(field => {
    const visible = properties![field]['x-visible'];
    if (isFunction(visible)) {
      properties![field]['x-visible'] = visible(extra);
    }
    return field;
  });
}

export function transformForm(schema: Schema): Question[] {
  const { properties } = schema;

  validateSchema(schema);
  const fields = Object.keys(schema.properties!);

  if (fields.length === 0) {
    return [];
  }

  const reactionMap: Record<string, any> = {};
  const questions: Question[] = fields.map(field => {
    const {
      type,
      title,
      default: defaultValue,
      enum: items,
      'x-visible': visible,
      'x-reactions': reactions,
    } = properties![field];
    if (type !== 'string') {
      throw Error('only support string schema');
    }
    reactions?.forEach(reaction => {
      if (!isFunction(reaction) && reaction.target) {
        reactionMap[reaction.target] = reaction.fulfill?.state;
      }
    });
    if (items) {
      return {
        type: 'list',
        name: field,
        message: title || field,
        default: defaultValue,
        when: visible,
        choices: items.map(item => ({
          type: 'choice',
          name: isObject(item) ? item.label : item,
          value: isObject(item) ? item.value : item,
        })),
      };
    }
    return {
      type: 'input',
      name: field,
      message: title || field,
      default: defaultValue,
      when: visible,
    };
  });

  return questions;
}
