import { useAppSelector } from "@/app/hooks";
import ListItemContainer from "@/components/ListItemContainer";
import Note from "@/components/Note";

export default function Favourite() {
  const { notes } = useAppSelector((state) => state.notes);

  const favouriteNotes = Array.from(notes.values()).filter(
    (note) => note.isFavourite,
  );

  return (
    <div>
      <div className="mb-4 mt-2 flex items-center justify-between px-4">
        <h2 className="text-xl font-semibold">Favourites</h2>
      </div>

      <ListItemContainer
        items={favouriteNotes}
        renderItem={(note) => <Note note={note} />}
      />
    </div>
  );
}
