import { type Schema, forEach, setInitValues } from '@modern-js/easy-form-core';
import { isUndefined } from '@modern-js/utils/lodash';

export function transformSchema(
  schema: Schema,
  configValue: Record<string, unknown> = {},
  validateMap: Record<
    string,
    (
      input: unknown,
      data?: Record<string, unknown>,
    ) => { success: boolean; error?: string }
  > = {},
  initValue: Record<string, unknown> = {},
) {
  forEach(schema, schemaItem => {
    if (schemaItem?.state?.cliLabel) {
      schemaItem.label = schemaItem.state.cliLabel;
    }
    const { when, validate } = schemaItem;
    schemaItem.when = (
      values: Record<string, any>,
      extra?: Record<string, unknown>,
    ) => {
      if (!isUndefined(configValue[schemaItem.key])) {
        return false;
      }
      return when ? when(values, extra) : true;
    };
    schemaItem.validate = async (
      value: any,
      data: Record<string, any>,
      extra?: Record<string, unknown>,
    ) => {
      if (validate) {
        const result = await validate(value, data, extra);
        if (!result.success) {
          return result;
        }
      }
      if (validateMap[schemaItem.key]) {
        return validateMap[schemaItem.key](value, data);
      }
      return {
        success: true,
      };
    };
  });
  return setInitValues(schema, initValue);
}
