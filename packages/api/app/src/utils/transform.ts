import { isString } from '@modern-js/utils/lodash';
import { Question } from 'inquirer';

export function transformInquirerSchema(
  schema: Question[],
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
  return schema.map(question => {
    question.default = initValue[question.name!] || question.default;
    question.validate = async (input, answers) => {
      if (question.validate) {
        const result = await question.validate(input, answers);
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
    return question;
  });
}
