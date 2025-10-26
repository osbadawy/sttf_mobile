export function getAvgValue<T extends Record<string, any>>(
  data: Record<string, T> | T[],
  keys: string[],
): number {
  if (!data || Object.keys(data).length === 0) {
    return 0;
  }
  const dataValues = Array.isArray(data) ? data : Object.values(data);
  const total = dataValues.reduce((sum, val) => {
    // Navigate to the most nested value using the keys array
    let current: any = val;
    for (const key of keys) {
      current = current?.[key];
    }
    return sum + ((current as number) || 0);
  }, 0);
  const numValues =
    dataValues.reduce((sum, val) => {
      // Check if the nested value exists
      let current: any = val;
      for (const key of keys) {
        current = current?.[key];
      }
      return current !== undefined && current !== null ? sum + 1 : sum;
    }, 0) || 1;
  return numValues > 0 ? total / numValues : 0;
}
