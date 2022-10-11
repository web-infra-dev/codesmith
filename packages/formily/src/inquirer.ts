import { prompt } from './prompt';
import { Schema } from './transform';

export interface ICLIReaderOptions {
  schema: Schema;
  validateMap?: Record<
    string,
    (
      input: unknown,
      data?: Record<string, unknown>,
    ) => { success: boolean; error?: string }
  >;
  initValue?: Record<string, unknown>;
}
export class CLIReader<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  schema: Schema | null = null;

  validateMap: Record<
    string,
    (
      input: unknown,
      data?: Record<string, unknown>,
    ) => { success: boolean; error?: string }
  >;

  initValue: Record<string, unknown>;

  answers: Record<string, unknown> = {};

  constructor(options: ICLIReaderOptions) {
    const { schema, validateMap, initValue } = options;
    this.schema = schema;
    this.validateMap = validateMap || {};
    this.initValue = initValue || {};
  }

  getAnswers() {
    return this.answers as T;
  }

  setAnswers(answers: Partial<T>) {
    this.answers = { ...this.answers, ...answers };
  }

  async start() {
    if (!this.schema) {
      throw Error('schema is not valid');
    }
    const answers = await prompt<T>(
      this.schema,
      this.answers,
      this.validateMap,
      this.initValue,
    );
    this.setAnswers(answers);
    return answers;
  }
}
