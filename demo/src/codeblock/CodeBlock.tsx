import { Div } from "@fluid/core";
import Highlight from "react-highlight";

export default function CodeBlock({ code }: { code: string }) {
  return (
    <Div className="bordered" fluid={{ spacing: [20], align: ["stretch", 1280] }}>
      <Highlight className="typescript">{code}</Highlight>
    </Div>
  );
}
