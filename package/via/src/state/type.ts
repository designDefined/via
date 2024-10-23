// from
export type SyncronousFrom<T> = () => T;
export type AsyncronousFrom<T> = () => Promise<T>;
export type From<T> = SyncronousFrom<T> | AsyncronousFrom<T>;

export type Update<T> = (prev: T) => Promise<T>;
