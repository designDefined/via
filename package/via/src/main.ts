import { subscribeState } from "./store";

const display = document.getElementById("display")!;
// const input = document.getElementById("input")! as HTMLInputElement;
// const saveButton = document.getElementById("save-button")!;
const alertButton = document.getElementById("alert-button")!;
const { dispatch, subscribe, getSnapshot } = subscribeState<{ text: string }>({ key: "testStore" });

subscribe(value => {
  display.innerText = value.context.value?.text ?? "";
});

alertButton.addEventListener("click", () => alert(getSnapshot().context.value?.text ?? "no text"));
setTimeout(() => dispatch({ type: "value.initialized", value: { text: "test text" } }), 2000);
