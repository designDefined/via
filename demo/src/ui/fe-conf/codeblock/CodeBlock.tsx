import { Div } from "@flexive/core";
import Highlight from "react-highlight";

export default function CodeBlock({ code }: { code: string }) {
  return (
    <Div className="bordered" f={{ spacing: [20], align: ["stretch", "auto", 1280] }}>
      <Highlight className="typescript">{code}</Highlight>
    </Div>
  );
}
