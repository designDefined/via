// import { DetailedHTMLProps, InputHTMLAttributes } from "react";
// import { FluidComponentProps } from "./types";
// import { useFluidStyle, useFluidClass } from "../hooks";

// export type InputComponentProps = FluidComponentProps<
//   DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
// >;

// export function Input({
//   // style
//   style,
//   flex,
//   flow,
//   align,
//   justify,
//   spacing,
//   isInline = true,
//   className,

//   // rest
//   ...props
// }: InputComponentProps) {
//   const memoizedStyle = useFluidStyle(
//     { flex, flow, align, justify, spacing, isInline },
//     style,
//   );
//   const memoizedClasses = useFluidClass({ ...props, className });

//   return <input {...props} style={memoizedStyle} className={memoizedClasses} />;
// }
