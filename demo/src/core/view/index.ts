import { View } from "viajs-core";
import { mock } from "../repository";

export const TextView = View<[], string>(() => ({
  key: ["view", "text"],
  from: () =>
    mock.get<string>("test_text").then(res => {
      return res ?? "";
    }),
}));
