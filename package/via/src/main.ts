// import { map } from "rxjs";
import { createState } from "./state";
import { View } from "./view/view";

const textDisplay = document.getElementById("textDisplay")!;
const answerDisplay = document.getElementById("answerDisplay")!;
const alertButton = document.getElementById("alert-button")!;
const input = document.getElementById("input")! as HTMLInputElement;
const saveButton = document.getElementById("save-button")!;

const textState = createState({
  id: "text",
  from: () => ({ text: "hello world" }),
  initialValue: { text: "hello world" },
});

const answerState = createState({
  id: "answer",
  from: () =>
    new Promise<{ answerText: string }>(res => {
      setTimeout(() => res({ answerText: "42" }), 2000);
    }),
  initialValue: new Promise<{ answerText: string }>(res => {
    setTimeout(() => res({ answerText: "42" }), 2000);
  }),
});

textState.subject.subscribe(snapshot => {
  textDisplay.innerText = snapshot.value.text;
});
answerState.subject.subscribe(snapshot => {
  if (snapshot.state === "fulfilled") answerDisplay.innerText = snapshot.value.answerText;
});

saveButton.addEventListener("click", () => textState.actor.send({ type: "set", value: { text: input.value } }));
alertButton.addEventListener("click", () => alert(answerState.subject.getValue().value?.answerText ?? "loading..."));

const numberView = View<[string], { name: string; value: number }>(name => ({
  key: ["number", name],
  from: () => ({ name, value: 42 }),
}));

numberView("test").subscribe(({ state, value }) => {
  console.log(state, value);
});

numberView("test").subscribe(({ state, value }) => {
  console.log(state, value);
});

setTimeout(() => {
  numberView("test").subscribe(({ state, value }) => {
    console.log("subscribe after 1000ms");
    console.log(state, value);
  });
}, 1000);
