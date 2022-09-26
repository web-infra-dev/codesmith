import inquirer, { Question } from 'inquirer';

export interface ICLIReaderOptions {
  questions: Question[];
}
export class CLIReader<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  questions: Question[] = [];

  answers: Record<string, unknown> = {};

  constructor(options: ICLIReaderOptions) {
    const { questions } = options;
    this.questions = questions;
  }

  getAnswers() {
    return this.answers as T;
  }

  setAnswers(answers: Partial<T>) {
    this.answers = { ...this.answers, ...answers };
  }

  async start() {
    const answers = await inquirer.prompt<T>(this.questions);
    this.setAnswers(answers);
    return answers;
  }
}
