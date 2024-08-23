export type Preserved = { _preserved: true };

export const isPreserved = <T>(value: T): value is T & Preserved => {
  return typeof value === "object" && value !== null && "_preserved" in value && value["_preserved"] === true;
};

type A = Omit<{ id: 1 }, "asdf"> | null;

const a = {} as A;

a?.id;
