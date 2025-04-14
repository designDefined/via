# Via

```typescript
const PokemonDetailView = View<PokemonDetail, { id: ID["POKEMON"] }>(({ id }) => ({
  key: "PokemonDetail",
  from: async prev => {
    const data = await PokemonRepository.getDetail({ id });
    return [...prev, ...data];
  },
  staleTime: time.long,
  cacheTime: time.long,
}));
```
