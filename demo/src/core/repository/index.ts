const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const get = async <T>(key: string) => {
  await delay(1000);
  const result = sessionStorage.getItem(key);
  console.log(result);
  if (!result) return undefined;
  return JSON.parse(result) as T;
};

const post = async <T>(key: string, body: T) => {
  await delay(1);
  sessionStorage.setItem(key, JSON.stringify(body));
  return body;
};

export const mock = {
  get,
  post,
};
