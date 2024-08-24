export type PropsWithClassName = Record<string, unknown> & { className?: string };

export const classifiedProps = Object.entries({
  ["event-click"]: ["onClick", "onMouseDown"],
  ["event-focus"]: ["onInput", "onChange", "onKeydown", "onFocus", "onBlur"],
  ["status-disabled"]: ["disabled"],
  ["status-error"]: ["error"],
});

export const parseFluidClass = (props: PropsWithClassName): string =>
  [
    props.className,
    ...classifiedProps.map(([className, keys]) => (keys.some(key => !!props[key]) ? className : undefined)),
  ]
    .filter(c => c !== undefined)
    .join(" ");

export const useFluidClass = (props: PropsWithClassName) => {
  return parseFluidClass(props); // TODO: memoize
};
