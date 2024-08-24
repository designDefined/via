import { useFluidStyle, useFluidClass } from "../../hooks";
import { FluidImgProps } from "../../types/fluidElementProps";

export function Img({ fluid, style, ...props }: FluidImgProps) {
  const fluidStyle = useFluidStyle(fluid, style, true);
  const fluidClass = useFluidClass(props);

  return <img {...props} style={fluidStyle} className={fluidClass} />;
}
