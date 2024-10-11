```typescript
import { subscribeState } from "./store";

const display = document.getElementById("display")!;
// const input = document.getElementById("input")! as HTMLInputElement;
// const saveButton = document.getElementById("save-button")!;
const alertButton = document.getElementById("alert-button")!;
const { dispatch, subscribe, getSnapshot } = subscribeState<{ text: string }>({ key: "testStore" });

TestView(5)
  .pipe(take(5))
  .subscribe(value => {
    display.innerText = value.text ?? "";
  });

setTimeout(() => TestView(5).invalidate(), 2000);

const PokemonView = View();
PokemonView.pipe().subscribe();
```
