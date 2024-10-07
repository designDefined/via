import { H6 } from "@flexive/core";
import { useView } from "viajs-react";
import { TodosView } from "../../../deprecated/core/feconf/view";

export default function TodoMessage() {
  const { value: todos } = useView({
    view: TodosView(),
  });

  if (todos.filter(({ isDone }) => !isDone).length < 1) return <H6 className="padded">할 일이 없습니다</H6>;

  return (
    <H6 className="padded">
      할 일:
      {todos
        .filter(({ isDone }) => !isDone)
        .map(({ content }) => content)
        .join(", ")}
    </H6>
  );
}
