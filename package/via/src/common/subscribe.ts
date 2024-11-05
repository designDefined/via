export type Subscribe<T> = {
  next?: (s: T) => void;
  from?: () => T;
};
