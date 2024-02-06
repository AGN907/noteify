import { cn } from "@/lib/utils";
import {
  EditorContent,
  generateText,
  useEditor,
  type JSONContent,
} from "@tiptap/react";
import { Item, Note } from "../ListItem/types";
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
          class: cn(
            "prose prose-sm fixed left-52 min-h-screen w-full p-2 dark:prose-invert sm:prose lg:prose-lg xl:prose-lg focus:outline-none",
            editable ? "top-20" : "top-8",
          ),
        },
      },
    },
    [note.id, editable],
  );

  return (
    <div className="ml-[26rem] w-full">
      {editor?.isEditable && <EditorToolbar editor={editor} />}
      <div className="w-full">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
