import inquirer from 'inquirer';
import { Schema, transformForm } from './transform';

// const handleXReactions = async (
//   xReactions: {
//     target: string;
//     dependencies: string;
//     when: string;
//     otherwise: { state: any; value: any };
//     fulfill: { state: any; value: any };
//   }[],
//   answers: { [key: string]: any },
//   items: ChoiceType[],
//   item: ChoiceType,
// ): Promise<{ [key: string]: any }> => {};

export async function prompt<
  T extends Record<string, unknown> = Record<string, unknown>,
>(schema: Schema): Promise<T> {
  const questions = transformForm(schema);
  let answers = {};

  for (const question of questions) {
    // const xReactions = question?.origin?.['x-reactions'] || [];
    let answer = {};

    // 处理 x-reactions，即表单联动
    // if (xReactions.length) {
    // answer = await handleXReactions(xReactions, answers, questions, question);
    // } else {
    answer = await inquirer.prompt(question);
    // }

    answers = {
      ...answers,
      ...answer,
    };
  }
  return answers as T;
}
