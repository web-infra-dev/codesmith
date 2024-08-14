import { merge } from '@modern-js/utils/lodash';
import type { GeneratorContext } from '@modern-js/codesmith';
import { CLIReader } from './inquirer';
import type { Schema } from './transform';

export * from './inquirer';
export type { Schema } from './transform';
export type { SchemaEnum } from '@formily/json-schema';
export { validate } from '@formily/validator';

export class FormilyAPI {
  protected readonly generatorContext: GeneratorContext;

  constructor(generatorContext: GeneratorContext) {
    this.generatorContext = generatorContext;
  }

  private mergeAnswers(
    answers: Record<string, any>,
    configValue: Record<string, any>,
  ) {
    const inputData = merge(answers, configValue);
    this.generatorContext.config = merge(
      this.generatorContext.config,
      inputData,
    );
    return inputData;
  }

  public async getInputBySchemaFunc(
    schemaFunc: (config?: Record<string, any>) => Schema,
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
    const reader = new CLIReader({
      schema: schemaFunc(configValue),
      validateMap,
      initValue,
    });
    reader.setAnswers(configValue);
    const answers = await reader.start();
    return this.mergeAnswers(answers, configValue);
  }
}
