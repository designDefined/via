import { StoredInput, update } from "./input";
import { initiateParser, Parser } from "./parser";
import { isStateModified, stateFromParserTree } from "./state";

const sampleParserTree = {
  id: Parser<number>,
  name: Parser<string>,
  author: Parser<{ name: string; age: number }>,
  style: {
    font: {
      size: Parser<number>,
      decoration: Parser<("bold" | "italic")[]>,
    },
  },
  tags: [
    {
      name: Parser<string>,
      color: Parser<"red" | "blue" | "green">,
      type: {
        importance: Parser<"primary" | "secondary">,
        isVisible: Parser<boolean>,
      },
    },
  ],
  references: [Parser<{ id: number; name: string }>],
};
type P = typeof sampleParserTree;

// test 1: initiateParser as stored
console.log("TEST 1");
const sampleStored: StoredInput<P> = {
  parser: sampleParserTree,
  state: stateFromParserTree(sampleParserTree),
  current: initiateParser(sampleParserTree),
};

// console.log(isState(sampleStored.state.references));
// console.log(isStateArray(sampleStored.state.references));

console.log(sampleStored);
console.log(isStateModified(sampleStored.state));

// test 2: update with partial
console.log("TEST 2");
const partial1 = update(
  sampleStored,
  {
    id: 5,
    name: "hello",
    author: { name: "jimmy", age: 17 },
    tags: [{ name: "thriller", type: { isVisible: true } }],
    style: { font: { decoration: ["bold"] } },
  },
  { silent: true },
);
console.log(isStateModified(partial1.state));
console.log(partial1.current);

// override array with partial
const partial2 = update(partial1, {
  name: "hello_revised",
  tags: [
    { name: "thriller_revised", color: "red" },
    { name: "bestseller", color: "green" },
  ],
});
console.log(isStateModified(partial2.state));
console.log(partial2.current);

// update array values
const partial3 = update(partial2, { tags: [undefined, undefined, { name: "worstseller" }] });
console.log(partial3.current);

// test 3: update with function
console.log("TEST 3");
const fn1 = update(sampleStored, (draft) => {
  draft.id = 7;
  draft.name = "functional";
  draft.tags.push({ name: "first_tag", color: "red", type: { isVisible: undefined, importance: undefined } });
  draft.references.push({ id: 1, name: "ref1" });
});
console.log(fn1.current);

// update array values
const fn2 = update(fn1, (draft) => {
  if (draft.tags[0]) draft.tags[0].type.importance = "primary";
  if (draft.references[0]) draft.references[0].id = 2;
  draft.style.font.decoration = ["bold"];
});
console.log(fn2.current);
