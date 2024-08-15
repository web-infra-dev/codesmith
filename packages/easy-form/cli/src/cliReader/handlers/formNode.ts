import '../../ICliConfig';
import type { IFormNodeOptions, QuestionHandler } from '../../ICli';
import { toPromiseQuestionHandlerLoop } from '../utils';

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type FormNodeConfig = {
  /** empty */
};

declare module '../../ICliConfig' {
  export interface CustomCliConfig {
    formNode?: FormNodeConfig;
  }
}

export interface FormNodeOptions extends IFormNodeOptions {
  formNode?: FormNodeConfig;
}

export const formNode = (options: FormNodeOptions): QuestionHandler => {
  const { childQuestionHandler = [] } = options;
  return toPromiseQuestionHandlerLoop(childQuestionHandler);
};
