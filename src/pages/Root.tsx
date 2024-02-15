import { useAppDispatch, useAppSelector } from "@/app/hooks";
import Editor from "@/components/editor/Editor";
import SidebarMenu from "@/components/shared/SidebarMenu";
import { debounce } from "@/lib/utils";
import { loadFolders } from "@/redux/folders/foldersSlice";
import { loadNotes, updateNote } from "@/redux/notes/notesSlice";
import { loadTags } from "@/redux/tags/tagsSlice";
import type { JSONContent } from "@tiptap/react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function Root() {
  const dispatch = useAppDispatch();
  const { selectedNoteId, notes, isNotesLoading } = useAppSelector(
    (state) => state.notes,
  );

  const { isFoldersLoading } = useAppSelector((state) => state.folders);

  const selectedNote = notes[selectedNoteId ?? ""];

  const debouncedUpdateNote = debounce(
    ({
      title = "",
      content,
    }: {
      title: string | undefined;
      content: JSONContent;
    }) => dispatch(updateNote({ title, content })),
    700,
  );

  useEffect(() => {
    dispatch(loadNotes());
    dispatch(loadFolders());
    dispatch(loadTags());
  }, []);

  if (isNotesLoading || isFoldersLoading) {
    return (
      <div className="flex h-full items-center justify-center pt-32">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-2">
            <span className="text-4xl">📝</span>
            <p className="text-xl">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <SidebarMenu />
      </div>
      <div className="fixed bottom-0 left-52 top-0">
        <div className="h-full w-80 space-y-4 overflow-scroll border border-l-accent">
          <Outlet />
        </div>
      </div>
      <div>
        {selectedNote ? (
          <Editor
            onChange={({ title = "New Note", content }) =>
              debouncedUpdateNote({ title, content })
            }
            note={selectedNote}
          />
        ) : (
          <div className="ml-52 flex h-full items-center justify-center pt-32">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-4xl">📝</span>
                <p className="text-xl">
                  Create a note or select an existing one
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
