import { map } from "rxjs";
import { fetchState } from "./store";

const display = document.getElementById("display")!;
// const input = document.getElementById("input")! as HTMLInputElement;
// const saveButton = document.getElementById("save-button")!;
const alertButton = document.getElementById("alert-button")!;

const [text, dispatch] = fetchState<{ text: string }>({ key: "text" });

text.pipe(map(snapshot => snapshot.context)).subscribe(ctx => {
  display.innerText = ctx.value?.text ?? "";
});

alertButton.addEventListener("click", () => alert(text.getValue() ?? "no text"));
setTimeout(() => dispatch({ type: "value.initialized", value: { text: "test text" } }), 2000);
