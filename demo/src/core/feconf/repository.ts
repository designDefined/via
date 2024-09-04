import { Todo } from "./entity";

const getTodos = async () => {
  const item = sessionStorage.getItem("via_todos");
  if (!item) return [] as Todo[];
  return JSON.parse(item) as Todo[];
};

const postTodo = async (content: string) => {
  const prev = await getTodos();
  const nextId = Math.max(...prev.map(({ id }) => id), 0) + 1;
  sessionStorage.setItem("via_todos", JSON.stringify([...prev, { id: nextId, content, isDone: false }]));
  return true;
};

const patchTodo = async (id: number, done: boolean) => {
  const prev = await getTodos();
  const next = prev.map(todo => (todo.id === id ? { ...todo, isDone: done } : todo));
  sessionStorage.setItem("via_todos", JSON.stringify(next));
  return done;
};

export const TodoRepository = {
  getTodos,
  postTodo,
  patchTodo,
};
