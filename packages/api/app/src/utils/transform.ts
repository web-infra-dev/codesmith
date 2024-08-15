import { isString } from '@modern-js/utils/lodash';
import type { Question } from 'inquirer';

export function transformInquirerSchema(
  questions: Question[],
  configValue: Record<string, unknown> = {},
  validateMap: Record<
    string,
    (
      input: unknown,
      data?: Record<string, unknown>,
    ) => { success: boolean; error?: string }
  > = {},
  initValue: Record<string, any> = {},
) {
  for (const question of questions) {
    question.default = initValue[question.name!] || question.default;
    const originValidate = question.validate;
    question.validate = async (input, answers) => {
      if (originValidate) {
        const result = await originValidate(input, answers);
        if (isString(result)) {
          return result;
        }
      }
      if (validateMap[question.name!]) {
        const result = validateMap[question.name!](input, configValue);
        if (result.error) {
          return result.error;
        }
      }
      return true;
    };
    if (configValue[question.name!]) {
      question.when = false;
    }
  }
  return questions;
}
