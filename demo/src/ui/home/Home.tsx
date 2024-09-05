import { Button, Div, Input, Main } from "@flexive/core";
import { useIntentSubmit, useView } from "viajs-react";
import { TestIntent, TestView } from "../../core/test";

export default function Home() {
  const { value: testView } = useView({ view: TestView() });
  const {
    state,
    value: { required, optional1, optional2 },
    isValid,
    isModified,
    set,
    submit,
    isWorking,
    reset,
  } = useIntentSubmit({
    intent: TestIntent(),
    initialSetter: testView,
  });

  console.log(state);
  console.log({ required, optional1, optional2 });

  return (
    <Main f={{ spacing: [16, 16] }}>
      <Div f={{ spacing: [16] }}>
        {isValid && <Div>valid</Div>}
        {isModified && <Div>modified</Div>}
      </Div>
      <Div f={{ flow: ["row"], spacing: [16, 16] }}>
        <Input value={required.value ?? ""} onChange={e => set({ required: e.target.value })} />
        <Button onClick={() => set({ required: undefined })}>reset</Button>
      </Div>
      <Div f={{ flow: ["row"], spacing: [16, 16] }}>
        <Input value={optional1.value ?? ""} onChange={e => set({ optional1: e.target.value })} />
        <Button onClick={() => set({ optional1: undefined })}>reset</Button>
      </Div>
      <Div f={{ flow: ["row"], spacing: [16, 16] }}>
        <Input
          value={optional2.value ?? ""}
          onChange={e => {
            set(draft => {
              draft.optional2 = e.target.value;
            });
          }}
        />
        <Button
          onClick={() => {
            set(draft => {
              draft.optional2 = undefined;
            });
          }}
        >
          reset
        </Button>
      </Div>
      <Button onClick={() => set({})}>nothing</Button>
      <Button
        onClick={() => {
          reset();
        }}
      >
        reset all
      </Button>
      <Button
        disabled={!isValid || !isModified}
        onClick={() => {
          submit().then(alert);
        }}
      >
        {isWorking ? "working" : "submit"}
      </Button>
    </Main>
  );
}
