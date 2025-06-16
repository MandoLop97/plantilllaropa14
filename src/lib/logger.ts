export const logger = {
  log: (...args: unknown[]) => {
    if (import.meta.env.MODE !== 'production') {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (import.meta.env.MODE !== 'production') {
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (import.meta.env.MODE !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error(...args);
  },
};
