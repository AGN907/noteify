import { useAppDispatch } from "@/app/hooks";
import { selectNote } from "@/redux/notes/notesSlice";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import { useRef } from "react";
import { PiArrowLeft } from "react-icons/pi";
import type { ExtendedItem } from "../ListItem/types";
import TagsPanel from "../TagPanel";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import EditorToolbar, { extensions } from "./EditorToolbar";

interface EditorProps {
  note: ExtendedItem<"note">;
  onChange: ({
    title,
    content,
  }: {
    title?: string;
    content?: JSONContent;
  }) => void;
}

export default function Editor(props: EditorProps) {
  const { note, onChange } = props;

  const titleRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const editable = !note.readonly;

  const editor = useEditor(
    {
      extensions,
      content: note.content,
      editable,

      onUpdate: ({ editor }) => {
        onChange({
          content: editor.getJSON(),
        });
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-md  flex w-full max-w-4xl flex-1 flex-col dark:prose-invert focus:outline-none prose-code:rounded-md prose-code:bg-slate-300 prose-code:text-slate-900 prose-pre:rounded-md prose-pre:bg-slate-300 prose-pre:p-2 prose-code:dark:bg-neutral-800 prose-code:dark:text-slate-100 prose-pre:dark:bg-neutral-800",
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
        <div className="flex flex-col gap-y-4 px-10 pt-2">
          <Input
            ref={titleRef}
            type="text"
            defaultValue={note.title}
            onChange={() =>
              onChange({
                title: titleRef.current?.value,
              })
            }
            className="border-none text-4xl font-semibold focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent"
          />
          <hr className="border-b-0 border-slate-300" />
        </div>

        <div className="flex flex-1 flex-col overflow-auto pt-2 md:px-10">
          <EditorContent editor={editor} className="flex w-full pb-4 pt-2" />
        </div>
      </div>
    </div>
  );
}
