import { Fragment } from "react";

interface ListItemContainerProps<T> {
  items: T[];
  renderItem: (item: T) => JSX.Element;
}

export default function ListItemContainer<T>(props: ListItemContainerProps<T>) {
  const { items, renderItem } = props;

  return (
    <ul className="h-screen overflow-y-auto pb-14">
      {items.map((item, index) => (
        <Fragment key={index}>{renderItem(item)}</Fragment>
      ))}
    </ul>
  );
}
