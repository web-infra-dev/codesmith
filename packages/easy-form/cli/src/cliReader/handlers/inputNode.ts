import '../../ICliConfig';
import type { IInputNodeOptions, QuestionHandler } from '../../ICli';
import { toPromiseQuestionHandler } from '../utils';

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type InputNodeConfig = {
  /** empty */
};

declare module '../../ICliConfig' {
  export interface CustomCliConfig {
    inputNode?: InputNodeConfig;
  }
}

export interface InputNodeOptions extends IInputNodeOptions {
  inputNode?: InputNodeConfig;
}

export const inputNode = (options: InputNodeOptions): QuestionHandler => {
  const { schema, nodeInfo, prompts, inquirer, promptModule } = options;
  return toPromiseQuestionHandler({
    schema,
    nodeInfo,
    type: 'input',
    inquirer,
    promptModule,
    prompts,
  });
};
