import dayjs from "dayjs";
import { Item, ItemTypes } from "../ListItem/types";
import { wrapList } from "./listWrappers";

interface ListItemContainerProps<C, T> {
  type: C;
  items: T[];
}

// TODO fix this type
export default function ListItemContainer<
  C extends keyof ItemTypes,
  T extends Item<C>,
>(props: ListItemContainerProps<C, T>) {
  const { items, type } = props;

  const Component = wrapList(type);

  const groupBy = (items: T[], fn: (item: T) => string) => {
    return items
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .filter((item) => !item.isPinned)
      .reduce(
        (acc, item) => {
          const key = fn(item);
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        },
        {} as Record<string, T[]>,
      );
  };

  const pinnedItems =
    type === "note" ? items.filter((item) => item.isPinned) : [];

  const grouped = groupBy(items, (item) =>
    Date.now() - item.createdAt < 24 * 60 * 60 * 1000
      ? "Recent"
      : dayjs(item.createdAt).calendar(),
  );

  const renderPinnedItems = () => {
    if (pinnedItems.length > 0) {
      return (
        <>
          <h3 className="rounded-md bg-accent pl-2 text-lg">Pinned</h3>
          {pinnedItems.map((item) => (
            <Component key={item.id} item={item} />
          ))}
        </>
      );
    }
  };

  return (
    <ul className="h-screen overflow-y-auto pb-14">
      {renderPinnedItems()}
      {Object.entries(grouped).map(([headerTitle, groupedItems]) => (
        <div key={headerTitle}>
          <h3 className="bg-neutral-800 pl-2 text-lg text-gray-50 dark:bg-slate-50 dark:text-neutral-800">
            {headerTitle}
          </h3>
          {groupedItems.map((item) => (
            <Component key={item.id} item={item} />
          ))}
        </div>
      ))}
    </ul>
  );
}
