import { Button, Div, Input, Main } from "@flexive/core";
import { useIntentSubmit } from "viajs-react";
import { TestIntent } from "../../core/test";

export default function Home() {
  const {
    value: { required, optional1, optional2 },
    isValid,
    isModified,
    set,
    submit,
    isWorking,
    errors,
  } = useIntentSubmit({
    intent: TestIntent(),
    resetImmediately: true,
  });

  console.log(errors);

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
        onClick={() =>
          set(draft => {
            draft.required = undefined;
            draft.optional1 = undefined;
            draft.optional2 = undefined;
          })
        }
      >
        reset all
      </Button>
      <Button
        disabled={!isValid}
        onClick={() => {
          submit().then(alert);
        }}
      >
        {isWorking ? "working" : "submit"}
      </Button>
    </Main>
  );
}
