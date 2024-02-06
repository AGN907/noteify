import { useAppSelector } from "@/app/hooks";
import { EditorContent, useEditor, type Content } from "@tiptap/react";
import EditorToolbar, { extensions } from "./EditorToolbar";

interface EditorProps {
  content: Content;
  editable: boolean;
  onChange: ({
    title,
    content,
  }: {
    title: string | undefined;
    content: Content;
  }) => void;
}

export default function Editor(props: EditorProps) {
  const { content, editable, onChange } = props;
  const { selectedNoteId } = useAppSelector((state) => state.notes);

  const editor = useEditor(
    {
      extensions,
      content,
      editable,

      onUpdate: ({ editor }) => {
        const title = editor.getJSON()?.content?.[0].content?.[0].text;

        onChange({
          title,
          content: editor.getJSON(),
        });
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-sm fixed left-52 top-20 min-h-screen w-full p-2 dark:prose-invert sm:prose lg:prose-lg xl:prose-lg focus:outline-none",
        },
      },
    },
    [selectedNoteId, editable],
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
