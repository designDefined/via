export const wait =
  (delay: number) =>
  <T>(data: T) => {
    return new Promise<T>(function (resolve) {
      setTimeout(() => resolve(data), delay);
    });
  };
