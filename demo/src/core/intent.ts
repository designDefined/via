import { Intent } from "viajs-core";
import { TodoRepository } from "./repository";
import { TodosView } from "./view";
import { ParserOf } from "../../../package/core";

export const ToggleTodoIntent = Intent<[number], () => boolean, boolean>(todoId => ({
  key: ["intent", "toggleTodo", { todoId }],
  to: async (done: boolean) => TodoRepository.patchTodo(todoId, done),
  next: () => [
    TodosView().set(draft => {
      const target = draft.find(({ id }) => id === todoId);
      if (target) target.isDone = !target.isDone;
    }),
  ],
}));

const AddTodoParser = {
  content: ParserOf<string>(input => {
    if (typeof input !== "string") throw new Error("Content is not a string");
    if (input === "") throw new Error("Content is empty");
    if (input.length > 10) throw new Error("Content is too long");
    return input;
  }),
};

export const AddTodoIntent = Intent<[], typeof AddTodoParser>(() => ({
  key: ["intent", "addTodo"],
  parser: AddTodoParser,
  to: async ({ content }) => TodoRepository.postTodo(content),
  next: () => [TodosView().invalidate],
}));
