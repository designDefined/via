export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[] | undefined
  : { [K in keyof T]?: DeepPartial<T[K]> } | undefined;

export type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};
