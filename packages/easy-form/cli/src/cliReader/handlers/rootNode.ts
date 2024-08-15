import '../../ICliConfig';
import type { IRootNodeOptions, QuestionHandler } from '../../ICli';

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type RootNodeConfig = {
  /** empty */
};
declare module '../../ICliConfig' {
  export interface CustomCliConfig {
    rootNode?: RootNodeConfig;
  }
}

export interface RootNodeOptions extends IRootNodeOptions {
  rootNode?: RootNodeConfig;
}

export const rootNode = (options: RootNodeOptions): QuestionHandler => {
  const { childQuestionHandler, prompts } = options;
  return async (answers: any) => {
    if (childQuestionHandler) {
      await childQuestionHandler(answers);
    }
    prompts.complete();
    return true;
  };
};
