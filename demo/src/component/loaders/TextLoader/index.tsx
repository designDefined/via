import { Div } from "@flexive/core";
import { PropsWithChildren, Suspense } from "react";

type TextLoaderProps = PropsWithChildren;
export const TextLoader = ({ children }: TextLoaderProps) => {
  return <Suspense fallback={<Div>loading...</Div>}>{children}</Suspense>;
};
