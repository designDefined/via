## Input

```ts
export const EditTodoInput = {
  title: () => z.string().min(1).max(20),
  deadline: { date: DateRaw.parse, time: TimeRaw.parse },
};

export const EditTodoIntent = Intent<typeof EditTodoInput, TodoDetail, [ID["todo"]]>((id) => ({
  key: ["intent", "editTodo", { id }],
  from: { title: "", deadline: { date: null, time: null } },
  input: EditTodoInput,
}));
```

```tsx
export default function DeadlineInputSection() {
  const todoId = useTodoId();
  const {
    value: { deadline: prevDeadline },
  } = useView({ view: TodoView(todoId) });

  const {
    set,
    value: { deadline },
  } = useIntentInput({
    intent: EditTodoIntent(todoId, { abc: string }),
    initialValue: { deadline: prevDeadline },
    config: { allow: false },
  });

  return (
    <section>
      <h2>DEADLINE</h2>
      <CalendarInput
        value={deadline.date.value}
        error={deadline.time.error}
        onChange={(date) => set({ deadline: { date } })}
      />
      <ClockInput
        value={deadline.time.value}
        error={deadline.time.error}
        onChange={(time) => set({ deadline: { time } })}
      />
    </section>
  );
}
```
