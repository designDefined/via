# via

## Getting Started

### Installation

```bash
# for react
yarn add viajs-core viajs-react
```

Both ESM and CJS supported.

### Provider

Use `createStore`

```tsx
// create store
const store = createStore();

// Add provider
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Via store={store}>
    <App />
  </Via>,
);
```

### View

`View` is a function that takes dependencies as an input, and returns informations to automatically fetch and subscribe `ViewState`: the readonly state provided to component.
Anything can be stored as `ViewState` - API response, post-processed user input, or mock data - unless it needs to be mutated directly inside the component.

Declare views you need with function named `View` anywhere outside the component.

```ts
const TodosView = View(() => ({
  key: ["todos"],
  from: () => getTodos(),
}));

// or with dependency
const TodoDetailView = View(todoId => ({
  key: ["todoDetail", todoId],
  from: () => getTodoOfId(todoId),
}));
```

Fuction `View` takes another function, called `Builder` as an argument. `Builder` takes depedencies, and return properties such as `key`, `from`, and several configs that form the contents of `View`.

#### Key

Just like `queryKey` of `@tanstack/react-query`, `View` returns an array of keys, which can be strings, numbers, or objects.
Keys are serialized: the order of items in array **does matter**, but the order of keys inside an object **doesn't**.
So feel safe to group dependencies into single object for convenience.

```ts
const TodoOfUserView = View((userId, keyId) => ({
  key: ["todoOfUser", { userId, keyId }],
  // ...
}));
```

#### From

From is a fetch function that returns value of `ViewState`. It doesn't have to be async function always, but it must take zero-argument. So if fetch function require some parameters, list them inside the dependencies.

```ts
const ItemInNameOfUserOfGroupView = View((groupId, userId, itemName) => ({
  key: ["itemInNameOfUserOfGroupView", { groupId, userId, itemName }],
  from: () => fetch(`api-endpoint/${groupId}/users/${userId}/items?name=${itemName}`),
}));
```

#### Types of View

`View` function takes type generics as `View<Deps[], ValueType>`. It's highly recommanded to provide proper types for both dependencies and value.

```ts
type User = { id: number; name: string; age?: number };
const UserView = View<[number], User>(userId => ({
  key: ["user", { userId }], // userId automatically inferred as number
  from: () => getUser(userId), // type error if from doesn't return User
}));
```

### useView

To read `ViewState` inside the component, you must call `useView` hook with `View` imported elsewhere.

```tsx
function UserComponent({ userId }) {
  const { value: user } = useView({ view: UserView(userId) });

  return <div>{user.username}</div>;
}
```

> tips: the value of `ViewState` always stored in the property `value`, so rename it immediately on destruction for readability

`useView` is always suspended. So

### Using Intent
