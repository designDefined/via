# Via React

```tsx
export function Component() {
  const id = usePokemonId();
  const { value: pokemonDetailHistory } = useView({
    view: PokemonDetailView(id).pipe(
      take(5),
      map(({ name }) => name),
    ),
  });

  const { value: pokemonDetailHistory2 } = useView({
    view: PokemonDetailView(id),
    pipe: [take(5), map(({ name }) => name)],
  });

  const { state } = useSubscribedState({
    key: "test",
    state: TestState(id).pipe(take(3)),
  });

  return <div>{state[0].name}</div>;
}
```
