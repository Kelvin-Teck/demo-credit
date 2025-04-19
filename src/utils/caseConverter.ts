import snakeCaseKeys from "snakecase-keys";

// Constrain T to either a Record (object) or array of Records
export const convertToSnakeCase = <
  T extends Record<string, unknown> | readonly Record<string, unknown>[]
>(
  data: T
): any => {
  return snakeCaseKeys(data, { deep: true });
};
