export const registeredCbs: Set<[string, (...args: unknown[]) => unknown]> =
  new Set();

export const addCbListener = (
  ev: string,
  fn: (...args: Array<unknown>) => void
): void => {
  if (registeredCbs.has([ev, fn])) return;
  samp.addEventListener(ev, fn);
  registeredCbs.add([ev, fn]);
};

export const removeCbListener = (
  ev: string,
  fn: (...args: Array<unknown>) => void
): void => {
  if (!registeredCbs.has([ev, fn])) return;
  samp.removeEventListener(ev, fn);
  registeredCbs.delete([ev, fn]);
};
