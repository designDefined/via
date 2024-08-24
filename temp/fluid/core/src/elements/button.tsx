// import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
// import { FluidComponentProps } from "./types";
// import { useFluidClass, useFluidStyle } from "../hooks";

// export type ButtonComponentProps = FluidComponentProps<
//   DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
// >;

// export function Button({
//   // children
//   children,

//   // style
//   style,
//   flex,
//   flow,
//   align,
//   justify,
//   spacing,
//   isInline,
//   className,

//   // rest
//   ...props
// }: ButtonComponentProps) {
//   const memoizedStyle = useFluidStyle(
//     { flex, flow, align, justify, spacing, isInline },
//     style,
//   );
//   const memoizedClasses = useFluidClass({ ...props, className });

//   return (
//     <button {...props} style={memoizedStyle} className={memoizedClasses}>
//       {children}
//     </button>
//   );
// }
