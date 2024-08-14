// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
const { hasOwnProperty } = Object.prototype;

export function isEmptyObject(obj: any): obj is any {
  if (!isObject(obj)) {
    return false;
  }

  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      return false;
    }
  }

  return true;
}

export function isObject(obj: any): obj is Record<string, any> {
  // The method can't do a type cast since there are type (like strings) which
  // are subclasses of any put not positvely matched by the function. Hence type
  // narrowing results in wrong results.
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj) &&
    !(obj instanceof RegExp) &&
    !(obj instanceof Date)
  );
}
