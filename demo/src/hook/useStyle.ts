import { CSSProperties, useMemo } from "react";
import { Align, Font, Material, Preset } from "../core/entity/common/style";

export type UseStyleParams = {
  material?: Material;
  align?: Align;
  font?: Font;
  preset?: Preset;
};

export const useStyle = ({ material, font, align, preset }: UseStyleParams = {}) => {
  const style: CSSProperties = useMemo(() => {
    const result: CSSProperties = {};
    if (material?.background?.color) result.backgroundColor = material.background.color;
    if (material?.border?.width) {
      result.borderStyle = "solid";
      result.borderWidth = material.border.width;
      result.borderColor = material.border.color ?? "black";
    }
    if (material?.border?.radius) result.borderRadius = material.border.radius;

    if (font?.color) result.color = font.color;
    if (font?.size) result.fontSize = font.size;
    if (font?.weight) result.fontWeight = font.weight;
    if (font?.lineHeight) result.lineHeight = font.lineHeight;
    if (font?.letterSpacing) result.letterSpacing = font.letterSpacing;
    if (align) result.textAlign = align;
    return result;
  }, [
    material?.background?.color,
    material?.border?.width,
    material?.border?.color,
    material?.border?.radius,
    font?.color,
    font?.size,
    font?.weight,
    font?.lineHeight,
    font?.letterSpacing,
    align,
  ]);

  const className = preset?.join(" ");

  return { style, className };
};
