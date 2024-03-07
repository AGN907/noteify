import { useAppDispatch, useAppSelector } from "@/app/hooks";
import Editor from "@/components/editor/Editor";
import SidebarMenu from "@/components/shared/SidebarMenu";
import { debounce } from "@/lib/utils";
import { loadFolders } from "@/redux/folders/foldersSlice";
import { loadNotes, updateNote } from "@/redux/notes/notesSlice";
import { loadTags } from "@/redux/tags/tagsSlice";
import type { JSONContent } from "@tiptap/react";
import { useEffect } from "react";
import { PiNotePencil, PiPencilLight } from "react-icons/pi";
import { Outlet } from "react-router-dom";

export default function Root() {
  const dispatch = useAppDispatch();
  const { selectedNoteId, notes, isNotesLoading } = useAppSelector(
    (state) => state.notes,
  );

  const { isFoldersLoading } = useAppSelector((state) => state.folders);

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const debouncedUpdateNote = debounce(
    ({ title, content }: { title?: string; content?: JSONContent }) => {
      dispatch(updateNote({ title, content }));
    },
    700,
  );

  useEffect(() => {
    dispatch(loadNotes());
    dispatch(loadFolders());
    dispatch(loadTags());
  }, []);

  if (isNotesLoading || isFoldersLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-2">
            <PiNotePencil className="animate-bounce" size={44} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div
        data-selected={!!selectedNoteId}
        className="col-span-3 flex max-w-xl flex-1 max-md:data-[selected=false]:col-span-9 max-md:data-[selected=true]:hidden"
      >
        <div className="h-screen max-w-52 xl:flex-1">
          <SidebarMenu />
        </div>
        <div className="h-full flex-1 space-y-4 md:max-w-96">
          <div className="border-r">
            <Outlet />
          </div>
        </div>
      </div>
      <div
        data-selected={!!selectedNoteId}
        className="flex h-full flex-1 flex-col max-md:data-[selected=false]:hidden"
      >
        {selectedNote ? (
          <Editor
            onChange={({ title, content }) =>
              debouncedUpdateNote({ title, content })
            }
            note={selectedNote}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="flex flex-wrap items-center space-x-2">
              <PiPencilLight size={28} />
              <p className="text-xl">Create a note or select an existing one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
