import { useAppSelector } from "@/app/hooks";
import ListItemContainer from "@/components/ListItemContainer";
import Note from "@/components/Note";

export default function Favourite() {
  const { notes } = useAppSelector((state) => state.notes);

  const favouriteNotes = Object.values(notes).filter(
    (note) => note.isFavourite,
  );

  return (
    <div>
      <div className="mb-4 mt-2 flex items-center justify-between px-4">
        <h2 className="text-xl font-semibold">Favourites</h2>
      </div>

      <div>
        {favouriteNotes.length === 0 && (
          <div className="flex justify-center space-x-2 px-4 pt-32">
            <div className="space-y-4">
              <p className="text-center">No favourite notes yet.</p>
              <p> Tip: Right click on the note to mark it as favourite</p>
            </div>
          </div>
        )}
        <ListItemContainer
          items={favouriteNotes}
          renderItem={(note) => <Note note={note} />}
        />
      </div>
    </div>
  );
}
