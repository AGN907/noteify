import { useAppDispatch, useAppSelector } from "@/app/hooks";
import ListItemContainer from "@/components/ListItemContainer";
import Note from "@/components/Note";
import { Button } from "@/components/ui/button";
import { createNote } from "@/redux/notes/notesSlice";
import { PiArrowLeft, PiFilePlus } from "react-icons/pi";
import { Params, useLoaderData, useNavigate } from "react-router-dom";

export async function loader({ params }: { params: Params<"folderId"> }) {
  const { folderId } = params;

  return { folderId };
}

export default function FolderContent() {
  const navigate = useNavigate();

  const { folderId } = useLoaderData() as { folderId: string | undefined };

  if (!folderId) {
    return <p>Folder not found</p>;
  }

  const { folders } = useAppSelector((state) => state.folders);
  const { notes } = useAppSelector((state) => state.notes);

  const dispatch = useAppDispatch();

  const selectedFolder = folders[folderId];

  const folderNotes = notes.filter(
    (note) => note.folderId === folderId && note.type === "note",
  );

  return (
    <div>
      <div className="flex items-center">
        <Button variant="link" size="icon">
          <PiArrowLeft size={24} onClick={() => navigate(-1)} />
        </Button>
        <h1 className="w-64 truncate p-4 text-2xl font-medium ">
          {selectedFolder.name}
        </h1>
        <Button variant="link" size="icon" className="ml-auto mr-4">
          <PiFilePlus
            onClick={() => {
              dispatch(createNote(folderId));
            }}
            size={32}
          />
        </Button>
      </div>
      <hr className="border-t border-accent" />
      {folderNotes.length === 0 && (
        <div className="flex items-center justify-center px-4 pt-32">
          <p>No notes yet. Add notes to this folder to view them here.</p>
        </div>
      )}
      <ListItemContainer
        items={folderNotes}
        renderItem={(note) => <Note note={note} />}
      />
    </div>
  );
}
