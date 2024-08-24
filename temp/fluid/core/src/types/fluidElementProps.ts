import {
  AnchorHTMLAttributes,
  BlockquoteHTMLAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FormHTMLAttributes,
  HTMLAttributes,
  ImgHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  LiHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { ComponentMap, FluidComponentProps } from "../core";

// common
export type FluidElementProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
  Map
>;

// Content Sectioning
export type FluidArticleProps<Map extends ComponentMap = true> = FluidElementProps<Map>;
export type FluidAsideProps<Map extends ComponentMap = true> = FluidElementProps<Map>;
export type FluidFooterProps<Map extends ComponentMap = true> = FluidElementProps<Map>;
export type FluidHeaderProps<Map extends ComponentMap = true> = FluidElementProps<Map>;
export type FluidHeadingProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
  Map
>;
export type FluidMainProps<Map extends ComponentMap = true> = FluidElementProps<Map>;
export type FluidNavProps<Map extends ComponentMap = true> = FluidElementProps<Map>;
export type FluidSectionProps<Map extends ComponentMap = true> = FluidElementProps<Map>;

// Text Content
export type FluidBlockquoteProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>,
  Map
>;
export type FluidDivProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  Map
>;
export type FluidLiProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>,
  Map
>;
export type FluidOlProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>,
  Map
>;
export type FluidPProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>,
  Map
>;
export type FluidPreProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>,
  Map
>;
export type FluidUlProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
  Map
>;

// Inline Text Semantics
export type FluidAProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  Map
>;
export type FluidCodeProps<Map extends ComponentMap = true> = FluidElementProps<Map>;
export type FluidIProps<Map extends ComponentMap = true> = FluidElementProps<Map>;
export type FluidSpanProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
  Map
>;
export type FluidStrongProps<Map extends ComponentMap = true> = FluidElementProps<Map>;

// Image and Multimedia
export type FluidImgProps = FluidComponentProps<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
>;

// Forms
export type FluidButtonProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  Map
>;
export type FluidFormProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  Map
>;
export type FluidInputProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  Map
>;
export type FluidLabelProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
  Map
>;
export type FluidTextareaProps<Map extends ComponentMap = true> = FluidComponentProps<
  DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
  Map
>;
