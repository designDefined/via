# VIA

```typescript
type Block = {
  id: () => number;
  name: () => string;
  style: {
    font: {
      size?: () => number;
      decoration?: () => ("bold" | "italic")[];
    };
  };
  tags: [
    {
      name: () => string;
      color: () => "red" | "blue" | "green";
    },
  ];
  references: [() => { id: number; name: string }];
};

const block = {
  id: undefined,
  name: undefined,
  style: {
    font: {
      size: undefined,
      decoration: undefined,
    },
  },
  tags: [],
  references: [],
};

set({ tags: { [2]: { name: "some2" } } }); // { tags: [undefined, undefined, { name: "some2" }] }
set({ tags: [{ name: "some0" }, { id: 1 }] }); // { tags: [{ name: "some0" }, { id: 1 }, { name: "some2" }] }
set((draft) => {
  draft.tags.push({ id: 3 });
}); // { tags: [{ name: "some0" }, { id: 1 }, { name: "some2" }, { id: 3 }] }

block.id;
block.name;
block.style.font; // { size?:number, decoration?: ("bold" | "italic")[] }
block.style.font.decoration?.includes("bold");
block.tags[0].name;
block.tags;
```
