import { createStore } from "./core/store/createStore";

const app = document.getElementById("app")!;
const { actor, subject } = createStore<{ text: string }>({ key: "testStore" });

subject.subscribe(value => {
  app.innerText = value.context.value?.text ?? "";
});

setTimeout(() => actor.send({ type: "value.initialized", value: { text: "test text" } }), 5000);
