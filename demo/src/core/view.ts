import { View } from "viajs-core";
import { Todo } from "./entity";
import { TodoRepository } from "./repository";

export const TodosView = View<[], Todo[]>(() => ({
  key: ["view", "todos"],
  from: () => TodoRepository.getTodos(),
}));
