/**
 * when promise is timeput, reject promise
 * @param {Promise} promise
 * @param {number} ms
 * @param {string} reason
 * @returns {Promise}
 */
export async function timeoutPromise(
  promise: Promise<any>,
  ms: number,
  reason = 'Operation',
) {
  let timeoutId: NodeJS.Timeout | null = null;
  const delayPromise = (ms: number) => {
    return new Promise(resolve => {
      timeoutId = setTimeout(resolve, ms);
    });
  };
  const timeout = delayPromise(ms).then(() => {
    throw new Error(`${reason} timed out after ${ms}ms`);
  });
  const result = await Promise.race([promise, timeout]);
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  return result;
}
