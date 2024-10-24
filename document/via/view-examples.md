# View Examples

### Store cache and from override

```ts
const numberView = View<[string], { name: string; value: number }>(name => ({
  key: ["number", name],
  from: () => ({ name, value: 42 }),
}));

numberView("test").subscribe(({ state, value }) => {
  console.log(state, value);
});

numberView("test")
  .from(() => ({ name: "over1", value: 43 }))
  .subscribe(({ state, value }) => {
    console.log(state, value);
  });

numberView("test2")
  .from(() => ({ name: "over2", value: 44 }))
  .subscribe(({ state, value }) => {
    console.log(state, value);
  });

setTimeout(() => {
  numberView("test").subscribe(({ state, value }) => {
    console.log("subscribe after 1000ms");
    console.log(state, value);
  });
}, 1000);

// pending undefined
// pending undefined
// pending undefined
// fulfilled {name: 'test', value: 42}
// fulfilled {name: 'test', value: 42}
// fulfilled {name: 'over2', value: 44}
// subscribe after 1000ms
// fulfilled {name: 'test', value: 42}
```
