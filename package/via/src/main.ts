import { getState } from "./store";

const app = document.getElementById("app")!;
const { actor, subject } = getState<{ text: string }>({ key: "testStore" });

subject.subscribe(value => {
  app.innerText = value.context.value?.text ?? "";
});

setTimeout(() => actor.send({ type: "value.initialized", value: { text: "test text" } }), 5000);
