export type InitSync<T> = () => T;
export type InitAsync<T> = () => Promise<T>;
export type UpdateSync<T> = (prev: T) => T;
export type UpdateAsync<T> = (prev: T) => Promise<T>;

export type Init<T> = InitSync<T> | InitAsync<T>;
export type Updater<T> = UpdateSync<T> | UpdateAsync<T>;
