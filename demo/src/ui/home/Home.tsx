import { Button, Div, Input } from "@flexive/core";
import { useIntentSubmit, useStoreSet, useView } from "viajs-react";
import { TextView } from "../../core/view";
import { TextIntent } from "../../core/intent";
import { Overlay, useOverlay, useOverlayController } from "../../util/overlay";
import { Suspense, useEffect } from "react";

export default function Home() {
  const { overlay, open } = useOverlay({ type: "center" });
  // const { value: prev } = useView({ view: TextView() });

  return (
    <Div f={{ flow: ["row"], spacing: [0, 20] }}>
      {/* {prev.length} */}
      <Button onClick={() => open()}>open</Button>
      <Reader />
      <Setter />
      <Overlay overlay={overlay}>
        <Suspense>
          <Modal />
        </Suspense>
      </Overlay>
    </Div>
  );
}

function Modal() {
  const { value: prev } = useView({ view: TextView() });
  const { value: text, set, isModified, submit } = useIntentSubmit({ intent: TextIntent() });
  const { close } = useOverlayController();
  useEffect(() => {}, []);
  return (
    <Div
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <Input type="text" value={text.value ?? prev} onChange={e => set(e.target.value)} />
      <Button disabled={!isModified} onClick={() => submit().then(() => close())}>
        done
      </Button>
    </Div>
  );
}
function Setter() {
  const { set } = useStoreSet();

  useEffect(() => {
    console.log("set");
    set({
      key: TextView().key,
      setter: "asdf",
      config: { override: true },
    });
  }, []);

  return null;
}

function Reader() {
  const { value: text } = useView({ view: TextView() });
  console.log(text);
  return <Div>{text}</Div>;
}
