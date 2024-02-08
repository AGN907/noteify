import { useAppSelector } from "@/app/hooks";
import ListItemContainer from "@/components/ListItemContainer";
import TrashNote from "@/components/TrashNote";

export default function Trash() {
  const { notes } = useAppSelector((state) => state.notes);

  const trashNotes = Object.values(notes).filter(
    (note) => note.type === "trash",
  );

  return (
    <div>
      <div className="mb-4 mt-2 flex items-center justify-between px-4">
        <h2 className="text-xl font-semibold">Trash</h2>
      </div>
      <div>
        {trashNotes.length === 0 && (
          <div className="flex items-center justify-center space-x-2 px-4 pt-32">
            <p>No notes in trash yet.</p>
          </div>
        )}

        <ListItemContainer
          items={trashNotes}
          renderItem={(note) => <TrashNote note={note} />}
        />
      </div>
    </div>
  );
}
