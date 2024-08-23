// import { Falsy, hashKeys, Key, RawKey } from "../util";
// import { Stored } from "./store";

// export type DebugStoreConfig = {
//   lens?: (RawKey | Falsy)[];
// };

// export const debugStore = ({ lens }: DebugStoreConfig) => {
//   const store = new Map<Key, Stored<any>>();
//   const targetKey = hashKeys(lens ?? []);

//   const get = (key: string) => {
//     if (key.startsWith(targetKey)) console.log(`GET ${key}`);
//     const result = store.get(key);
//     if (key.startsWith(targetKey)) console.log(result);
//     return result;
//   };

//   const set = (key: string, value: any) => {
//     if (key.startsWith(targetKey)) console.log(`SET ${key}`);
//     if (key.startsWith(targetKey)) console.log(value);
//     store.set(key, value);
//   };

//   const _delete = (key: string) => {
//     if (key.startsWith(targetKey)) console.log(`DELETE ${key}`);
//     store.delete(key);
//   };

//   const forEach = store.forEach.bind(store);

//   return { get, set, delete: _delete, forEach };
// };
