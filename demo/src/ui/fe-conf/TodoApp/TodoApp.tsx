import { Li, Div } from "@flexive/core";
import { useIntent, useIntentSubmit, useView } from "viajs-react";
import { Todo } from "../../../deprecated/core/feconf/entity";
import { AddTodoIntent, ToggleTodoIntent } from "../../../deprecated/core/feconf/intent";
import { TodosView } from "../../../deprecated/core/feconf/view";

export default function TodoApp() {
  const { value: todos } = useView({
    view: TodosView(),
  });

  const {
    set,
    submit,
    value: { content },
  } = useIntentSubmit({
    intent: AddTodoIntent(),
  });

  return (
    <div className="padded">
      <ol>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ol>
      <div>
        <input
          className="contentInput"
          type="text"
          value={content.value ?? ""}
          onChange={e => set({ content: e.target.value })}
        />
        <button
          className="addButton"
          disabled={!content.value || !!content.error}
          onClick={() => {
            submit();
          }}
        >
          추가
        </button>
      </div>
    </div>
  );
}

function TodoItem({ todo }: { todo: Todo }) {
  const { send, isWorking } = useIntent({
    intent: ToggleTodoIntent(todo.id),
  });

  return (
    <Li className="todo">
      <Div f={{ flow: ["row", "nowrap", "center"] }}>
        <div>{todo.content}</div>
        <input
          type="checkbox"
          checked={todo.isDone}
          disabled={isWorking}
          onChange={() => {
            send(!todo.isDone);
          }}
        />
      </Div>
    </Li>
  );
}
