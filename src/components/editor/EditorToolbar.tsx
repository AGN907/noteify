import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  PiArrowUUpLeft,
  PiArrowUUpRight,
  PiBracketsCurly,
  PiCode,
  PiListBullets,
  PiListNumbers,
  PiMinus,
  PiQuotes,
  PiTextB,
  PiTextItalic,
  PiTextStrikethrough,
} from "react-icons/pi";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const extensions = [StarterKit];

export default function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const toggleHeading = (level: Level) => {
    if (level === 0) {
      return editor.chain().focus().setParagraph().run();
    }

    editor.chain().focus().setHeading({ level }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 overflow-x-auto bg-background px-2 py-4">
      <Select onValueChange={(value) => toggleHeading(Number(value) as Level)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Paragraph" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Paragraph</SelectItem>
          <SelectItem value="1">H1</SelectItem>
          <SelectItem value="2">H2</SelectItem>
          <SelectItem value="3">H3</SelectItem>
          <SelectItem value="4">H4</SelectItem>
          <SelectItem value="5">H5</SelectItem>
          <SelectItem value="6">H6</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`rounded-md p-1 ${editor.isActive("bold") ? "bg-accent" : ""}`}
      >
        <PiTextB size={22} />
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`rounded-md p-1 ${editor.isActive("italic") ? "bg-accent" : ""}`}
      >
        <PiTextItalic size={22} />
      </Button>

      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`rounded-md p-1 ${editor.isActive("strike") ? "bg-accent" : ""}`}
      >
        <PiTextStrikethrough size={22} />
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`rounded-md p-1 ${editor.isActive("code") ? "bg-accent" : ""}`}
      >
        <PiCode size={22} />
      </Button>

      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`rounded-md p-1 ${editor.isActive("bulletList") ? "bg-accent" : ""}`}
      >
        <PiListBullets size={22} />
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`rounded-md p-1 ${editor.isActive("orderedList") ? "bg-accent" : ""}`}
      >
        <PiListNumbers size={22} />
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`rounded-md p-1 ${editor.isActive("codeBlock") ? "bg-accent" : ""}`}
      >
        <PiBracketsCurly size={22} />
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`rounded-md p-1 ${editor.isActive("blockquote") ? "bg-accent" : ""}`}
      >
        <PiQuotes size={22} />
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <PiMinus size={22} />
      </Button>

      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="cursor-pointer"
      >
        <PiArrowUUpLeft size={22} />
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="cursor-pointer"
      >
        <PiArrowUUpRight size={22} />
      </Button>
    </div>
  );
}
