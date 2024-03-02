import { useAppDispatch } from "@/app/hooks";
import { selectNote } from "@/redux/notes/notesSlice";
import {
  EditorContent,
  generateText,
  useEditor,
  type JSONContent,
} from "@tiptap/react";
import { PiArrowLeft } from "react-icons/pi";
import type { Item, Note } from "../ListItem/types";
import TagsPanel from "../TagPanel";
import { Button } from "../ui/button";
import EditorToolbar, { extensions } from "./EditorToolbar";

interface EditorProps {
  note: Item<Note>;
  onChange: ({
    title,
    content,
  }: {
    title: string | undefined;
    content: JSONContent;
  }) => void;
}

export default function Editor(props: EditorProps) {
  const { note, onChange } = props;

  const dispatch = useAppDispatch();

  const editable = !note.readonly;

  const editor = useEditor(
    {
      extensions,
      content: note.content,
      editable,

      onUpdate: ({ editor }) => {
        const editorContent = editor.getJSON();
        const title = editorContent.content?.[0];

        onChange({
          title: title && generateText(title, extensions),
          content: editor.getJSON(),
        });
      },
      editorProps: {
        attributes: {
          class:
            "prose-md prose prose-sm flex w-full max-w-4xl flex-1 flex-col px-4 dark:prose-invert lg:prose-lg xl:prose-lg focus:outline-none prose-code:rounded-md prose-code:bg-slate-300 prose-code:text-slate-900 prose-pre:rounded-md prose-pre:bg-slate-300 prose-pre:p-2 prose-code:dark:bg-neutral-800 prose-code:dark:text-slate-100 prose-pre:dark:bg-neutral-800",
        },
      },
    },
    [note.id, editable],
  );

  const handleGoBack = () => {
    dispatch(selectNote(null));
  };

  return (
    <div className="flex h-full flex-1 justify-center lg:px-10">
      <Button
        onClick={() => handleGoBack()}
        variant="link"
        size="icon"
        data-selected={!!note.id}
        className="md:data-[selected]:hidden"
      >
        <PiArrowLeft size={24} />
      </Button>
      <div
        data-readonly={!editable}
        className="group flex h-full w-full max-w-4xl flex-1 flex-col gap-4 data-[readonly=true]:pt-4"
      >
        <div className="group-data-[readonly=true]:hidden">
          <EditorToolbar editor={editor} />
        </div>
        <TagsPanel />
        <div className="flex flex-1 flex-col overflow-auto pt-2 md:px-10">
          <EditorContent editor={editor} className="flex w-full pb-4" />
        </div>
      </div>
    </div>
  );
}
