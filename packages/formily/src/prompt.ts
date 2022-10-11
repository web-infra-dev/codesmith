import { Schema as FormilySchema, SchemaReaction } from '@formily/json-schema';
import inquirer, { QuestionCollection } from 'inquirer';
import { Question, Schema, transformForm } from './transform';

type XReaction = Exclude<SchemaReaction<any>, (field: any, scope: any) => void>;

// adjust rule
const compileRule = (rule: any, scope: any): any => {
  const state = FormilySchema.compile(rule, {
    $self: {},
    $values: {},
    $target: {},
    $deps: {},
    $dependencies: {},
    $observable: {},
    $effect: {},
    $memo: {},
    $props: {},
    $form: {},
    ...scope,
  });
  return state;
};

const handleXReactions = async (
  xReactions: XReaction[],
  answers: Record<string, any>,
  items: Question[],
  item: Question,
): Promise<Record<string, any>> => {
  let answer: Record<string, any> = {};
  for (const xReaction of xReactions) {
    const isActive = xReaction?.target; // active mode
    const isPassive = xReaction?.dependencies; // passive mode
    if (isActive) {
      // active mode need get item value to add status to target
      if (answers[item.name!] === undefined) {
        answer = await inquirer.prompt(item as QuestionCollection);
        answers[item.name!] = answer[item.name!];
      }
      const scope = {
        $self: {
          ...item,
          value: answer[item.name!],
        },
        $values: answers,
        $target: items.find(it => it.name === xReaction?.target),
      };
      // get rule state
      const state =
        xReaction?.when && !compileRule(xReaction?.when, scope)
          ? compileRule(xReaction?.otherwise?.state, scope)
          : compileRule(xReaction?.fulfill?.state, scope);
      // adjust target schema status
      for (const it of items) {
        if (it.name !== xReaction?.target) {
          continue;
        }

        if (it.type === 'void') {
          throw new Error(
            `${item.name} x-reactions specifies the target ${it.name}, The type cannot be void and must be a real form`,
          );
        }

        if (state?.value !== undefined) {
          it.default = state.value;
        }

        if (state?.visible === false) {
          it.when = false;
        }
      }
    } else if (isPassive) {
      // passive need to get dependencies value to adjust item status
      const dependencies = xReaction?.dependencies;
      const $dependencies = items
        .filter(it => (dependencies as any[]).includes(it.name))
        .map(it => answers[it.name!]);
      const scope = {
        $self: {
          ...item,
          value: answer[item.name!],
        },
        $values: answers,
        $deps: $dependencies,
        $dependencies,
      };

      const state =
        xReaction?.when && !compileRule(xReaction?.when, scope)
          ? compileRule(xReaction?.otherwise?.state, scope)
          : compileRule(xReaction?.fulfill?.state, scope);

      if (state.value !== undefined) {
        item.default = state.value;
      }

      if (state?.visible === false) {
        item.when = false;
      }
    } else {
      throw new Error(
        `${item.name}'s x-reactions must have either targe or dependencies!`,
      );
    }
  }

  // passive mode need to prompt
  if (answers[item.name!] === undefined) {
    answer = await inquirer.prompt(item as QuestionCollection);
  }
  return answer;
};

export async function prompt<
  T extends Record<string, unknown> = Record<string, unknown>,
>(
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
): Promise<T> {
  const questions = transformForm(schema, configValue, validateMap, initValue);
  let answers = {};

  for (const question of questions) {
    const xReactions = question?.origin?.['x-reactions'] || [];
    let answer = {};

    // handle x-reactions
    if (xReactions.length) {
      answer = await handleXReactions(xReactions, answers, questions, question);
    } else {
      answer = await inquirer.prompt(question as QuestionCollection);
    }

    answers = {
      ...answers,
      ...answer,
    };
  }
  return answers as T;
}
