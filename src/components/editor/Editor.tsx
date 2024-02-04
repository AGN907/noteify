import { Content, EditorContent, useEditor } from "@tiptap/react";
import EditorToolbar, { extensions } from "./EditorToolbar";

interface EditorProps {
  content: Content;
  onChange: (content: string, title?: string) => void;
}

export default function Editor(props: EditorProps) {
  const { content, onChange } = props;

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      const title = editor.getJSON()?.content?.[0].content?.[0].text;

      onChange(editor.getHTML(), title);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm fixed left-52 top-20 min-h-screen w-full p-2 dark:prose-invert sm:prose lg:prose-lg xl:prose-lg focus:outline-none",
      },
    },
  });

  return (
    <div className="ml-[26rem] w-full">
      <EditorToolbar editor={editor} />
      <div className="w-full">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
