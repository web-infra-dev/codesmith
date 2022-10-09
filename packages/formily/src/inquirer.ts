import { prompt } from './prompt';
import { Schema } from './transform';

export interface ICLIReaderOptions {
  schema: Schema;
}
export class CLIReader<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  schema: Schema | null = null;

  answers: Record<string, unknown> = {};

  constructor(options: ICLIReaderOptions) {
    const { schema } = options;
    this.schema = schema;
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
    const answers = await prompt<T>(this.schema);
    this.setAnswers(answers);
    return answers;
  }
}
