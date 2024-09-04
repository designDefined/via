const view1 = `export const TodosView = View<[], Todo[]>(() => ({
  key: ["view", "todos"],
  from: () => TodoRepository.getTodos(),
}));`;

const view2 = `export const TodosView = View<[], Todo[]>(() => ({
  key: ["view", "todos"],
  from: () => TodoRepository.getTodos(),
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 30,
}));`;

const useView = `export default function TodoApp() {
  const { value: todos } = useView({
    view: TodosView(),
  });

  return (
    <div>
      <ol>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ol>
    </div>
  );
}`;

const intent = `export const ToggleTodoIntent = Intent<[number], () => boolean, boolean>(todoId => ({
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
  content: Parser<string>,
};
export const AddTodoIntent = Intent<[], typeof AddTodoParser>(() => ({
  key: ["intent", "addTodo"],
  parser: AddTodoParser,
  to: async ({ content }) => TodoRepository.postTodo(content),
  next: () => [TodosView().invalidate],
}));
`;

const useIntent = `const { send, isWorking } = useIntent({
  intent: ToggleTodoIntent(todo.id),
});`;

const useIntentSubmit = `const {
  set,
  submit,
  value: { content },
} = useIntentSubmit({
  intent: AddTodoIntent(),
});`;

const parser = `const AddTodoParser = {
  content: (input: unknown): string => {
    if (typeof input !== "string") throw new Error("Content is not a string");
    if (input === "") throw new Error("Content is empty");
    if (input.length > 10) throw new Error("Content is too long");
    return input;
  },
};`;

const todoApp = `export function TodoApp() {
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
    <div>
      <ol>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ol>
      <div>
        <input
          type="text"
          value={content.value ?? ""}
          onChange={e => set({ content: e.target.value })}
        />
        <button
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

export function TodoItem({ todo }: { todo: Todo }) {
  const { send, isWorking } = useIntent({
    intent: ToggleTodoIntent(todo.id),
  });

  return (
    <li>
      <div>{todo.content}</div>
      <input
        type="checkbox"
        checked={todo.isDone}
        disabled={isWorking}
        onChange={() => {
          send(!todo.isDone);
        }}
      />
    </li>
  );
}

export function TodoMessage() {
  const { value: todos } = useView({
    view: TodosView(),
  });

  if (todos.filter(({ isDone }) => isDone).length < 1) return <div>할 일이 없습니다</div>;

  return (
    <div>
      할 일:
      {todos
        .filter(({ isDone }) => isDone)
        .map(({ content }) => content)
        .join(", ")}
    </div>
  );
}
`;

export const viaExample = {
  view1,
  view2,
  useView,
  intent,
  useIntent,
  useIntentSubmit,
  parser,
  todoApp,
};
