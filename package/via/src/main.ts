// import { map } from "rxjs";
import { createState } from "./state";

const textDisplay = document.getElementById("textDisplay")!;
const answerDisplay = document.getElementById("answerDisplay")!;
const alertButton = document.getElementById("alert-button")!;
const input = document.getElementById("input")! as HTMLInputElement;
const saveButton = document.getElementById("save-button")!;

const textState = createState<{ text: string }>({
  id: "text",
  from: () => ({ text: "hello world" }),
});

const answerState = createState<{ answerText: string }>({
  id: "answer",
  from: () =>
    new Promise(res => {
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
