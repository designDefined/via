# Fluid Core

```tsx
type LabeledInputProps = FluidInputProps<{ label: true; input: true }> & { labelText: string };

export default function LabeledInput({ fluid, className, labelText, ...props }: LabeledInputProps) {
  const { fx, cx } = useFluidSystem({ fluid, className });

  return (
    <Label className={cx.root("LabeledInput")} fluid={fx.root({ flex: [1, 1, 0] })} style={style} {...props}>
      <Div className={cx.label("label")}>{labelText}</Div>
      <Input />
    </Label>
  );
}
```
