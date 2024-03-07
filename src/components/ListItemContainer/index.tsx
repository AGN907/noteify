import dayjs from "dayjs";
import type { Item, ListTypes } from "../ListItem/types";

// Todo: Use the `type` to infer the type of the items array and render a Component from an Object of Components instead of using a renderItem function
type ListItemContainerProps<T, C> = {
  type: T;
  items: C[];
  renderItem: (item: C) => JSX.Element;
};

const ListItemContainer = <T extends keyof ListTypes>({
  type,
  items,
  renderItem,
}: ListItemContainerProps<
  T,
  T extends keyof ListTypes ? ListTypes[T] : Item
>) => {
  const sortedItems = items.slice().sort((a, b) => b.updatedAt - a.updatedAt);

  const groupedByDate = sortedItems.reduce(
    (acc, item) => {
      const date = dayjs(item.updatedAt).calendar();

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    },
    {} as { [date: string]: typeof items },
  );

  return (
    <ul className="h-screen overflow-y-auto pb-14">
      {Object.entries(groupedByDate).map(([date, items]) => (
        <div key={date}>
          <h2 className="px-1 pt-4 text-xl font-semibold">{date}</h2>
          {items.map(renderItem)}
        </div>
      ))}
    </ul>
  );
};

export default ListItemContainer;
