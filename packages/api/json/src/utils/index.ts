import type { FsResource, GeneratorCore } from '@modern-js/codesmith';

export async function editJson(
  generatorCore: GeneratorCore,
  resource: FsResource,
  getNewJsonValue: (text: string) => Promise<string>,
): Promise<string> {
  const originJsonValue = await resource.value();
  const newJsonString = await getNewJsonValue(
    originJsonValue.content as string,
  );
  if (!newJsonString) {
    throw new Error('get new json string is undefined');
  }
  await generatorCore.output.fs(resource.filePath, newJsonString, {
    encoding: 'utf-8',
  });
  return newJsonString;
}
