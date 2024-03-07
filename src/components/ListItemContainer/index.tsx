import dayjs from "dayjs";
import type { Item, ListTypes } from "../ListItem/types";
import { getListWrapper } from "./listWrappers";

type ListItemContainerProps<T, C> = {
  type: T;
  items: C[];
};

const ListItemContainer = <T extends keyof ListTypes>({
  type,
  items,
}: ListItemContainerProps<
  T,
  T extends keyof ListTypes ? ListTypes[T] : Item
>) => {
  const Component = getListWrapper(type);
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

  let pinnedItems: ListTypes["note"][] = [];
  if (type === "note") {
    const noteItems = items as ListTypes["note"][];
    pinnedItems = noteItems.filter((item) => item.isPinned);
  }

  return (
    <ul className="h-screen overflow-y-auto pb-14">
      {pinnedItems.length > 0 && (
        <div>
          <h2 className="px-1 pt-4 text-xl font-semibold">Pinned</h2>
          {pinnedItems.map((item) => (
            <Component key={item.id} item={item} />
          ))}
        </div>
      )}
      {Object.entries(groupedByDate).map(([date, items]) => (
        <div key={date}>
          <h2 className="px-1 pt-4 text-xl font-semibold">{date}</h2>
          {items.map((item) => (
            <Component key={item.id} item={item} />
          ))}
        </div>
      ))}
    </ul>
  );
};

export default ListItemContainer;
