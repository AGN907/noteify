interface ListItemContainerProps<T> {
  items: T[];
  renderItem: (item: T) => JSX.Element;
}

export default function ListItemContainer<T>(props: ListItemContainerProps<T>) {
  const { items, renderItem } = props;

  return <ul>{items.map((item) => renderItem(item))}</ul>;
}
