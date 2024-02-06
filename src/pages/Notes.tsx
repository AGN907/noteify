import { useAppDispatch, useAppSelector } from "@/app/hooks";
import ListItemContainer from "@/components/ListItemContainer";
import Note from "@/components/Note";
import { Button } from "@/components/ui/button";
import { createNote } from "@/redux/notes/notesSlice";
import { PiPlusCircleFill } from "react-icons/pi";

function Notes() {
  const { notes } = useAppSelector((state) => state.notes);
  const dispatch = useAppDispatch();

  const notesArray = Array.from(notes.values()).filter(
    (item) => item.type === "note",
  );

  return (
    <div>
      <div className="mb-4 mt-2 flex items-center justify-between px-4">
        <h2 className="text-xl font-semibold">Notes</h2>
        <Button
          aria-label="Create a new note"
          variant="link"
          size="icon"
          onClick={() => dispatch(createNote())}
        >
          <PiPlusCircleFill size={32} />
        </Button>
      </div>
      <div>
        {notesArray.length === 0 && (
          <div className="flex items-center justify-center space-x-2 px-4 pt-32">
            <p>
              No notes yet. Click the{" "}
              <PiPlusCircleFill className="inline" size={20} /> button to create
              a new note.
            </p>
          </div>
        )}
        <ListItemContainer
          items={notesArray}
          renderItem={(note) => <Note note={note} />}
        />
      </div>
    </div>
  );
}

export default Notes;
