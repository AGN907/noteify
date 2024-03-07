import { useAppSelector } from "@/app/hooks";
import ListItemContainer from "@/components/ListItemContainer";
import Note from "@/components/Note";

export default function Trash() {
  const { notes } = useAppSelector((state) => state.notes);

  const trashNotes = notes.filter((note) => note.type === "trash");

  return (
    <div>
      <div className="mb-4 mt-2 flex items-center justify-between px-4 max-xl:pl-14">
        <h2 className="text-xl font-semibold">Trash</h2>
      </div>
      <div>
        {trashNotes.length === 0 && (
          <div className="flex items-center justify-center space-x-2 px-4 pt-32">
            <p>No notes in trash yet.</p>
          </div>
        )}

        <ListItemContainer
          type="trash"
          items={trashNotes}
          renderItem={(item) => <Note item={item} />}
        />
      </div>
    </div>
  );
}
