export const clearEmpties = <T extends object>(source: T): Partial<T> => {
  const entries = Object.entries(source).filter(([, value]) =>
    typeof value === 'string' ? Boolean(value) : true,
  );

  return Object.fromEntries(entries) as Partial<T>;
};
