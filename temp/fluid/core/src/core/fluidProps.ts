import { FluidStyle } from "./fluidStyle";

export type ComponentMap = { [key: string]: ComponentMap | true } | true;

export type ClassNameMap<ComponentMap> = ComponentMap extends true
  ? string
  : { [K in keyof ComponentMap]: ClassNameMap<ComponentMap[K]> };

export type FluidStyleMap<ComponentMap> = ComponentMap extends true
  ? FluidStyle
  : { [K in keyof ComponentMap]: FluidStyleMap<ComponentMap[K]> };

export type FluidComponentProps<OriginalProps extends object, Map extends ComponentMap = true> = Omit<
  OriginalProps,
  "className"
> & {
  className?: string | ClassNameMap<Map>;
  fluid?: FluidStyle | FluidStyleMap<Map>;
};
