import { createStore } from "./core/store/createStore";

const { actor } = createStore<{ text: string }>({ key: "testStore" });

actor.send({ type: "value.initialized", value: { text: "test text" } });
