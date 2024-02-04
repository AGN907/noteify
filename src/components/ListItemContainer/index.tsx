import { Item } from "../ListItem/types";

interface ListItemContainerProps<T> {
  items: Item<T>[];
  renderItem: (item: Item<T>) => JSX.Element;
}

export default function ListItemContainer<T>(props: ListItemContainerProps<T>) {
  const { items, renderItem } = props;

  return <ul>{items.map((item) => renderItem(item))}</ul>;
}
