import { useAppSelector } from "@/app/hooks";
import { useRef, useState } from "react";
import TagBadge from "../TagBadge";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

type AssignTagDialogProps = {
  children: React.ReactNode;
  onTagAssign: (name: string, isNew?: boolean) => void;
  onTagRemove: (tagId: string) => void;
};

export default function AssignTagDialog(props: AssignTagDialogProps) {
  const { children, onTagAssign, onTagRemove } = props;
  const [tagName, setTagName] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const { tags: allTags } = useAppSelector((state) => state.tags);
  const { selectedNoteId, notes } = useAppSelector((state) => state.notes);

  if (!selectedNoteId) return null;

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  if (!selectedNote) return null;

  const selectedTags = selectedNote?.tags.map((tagId) =>
    allTags.find((t) => t.id === tagId),
  );

  const filteredTags = tagName
    ? allTags
        .filter(
          (tag) =>
            tag.name.toLowerCase().includes(tagName.toLowerCase()) &&
            !selectedTags.some((t) => t?.id === tag.id),
        )
        .slice(0, 10)
    : allTags.filter((tag) => !selectedTags.some((t) => t?.id === tag.id));

  const handleChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);
    if (tagName && e.key === "Enter") {
      onTagAssign(
        tagName,
        !allTags.some(
          ({ name }) => name.toLowerCase() === tagName.toLowerCase(),
        ),
      );
      setTagName("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Assign tag</DialogHeader>
        <div className="relative flex flex-wrap gap-2 p-4">
          {selectedTags?.map((tag) => (
            <>
              {tag ? (
                <TagBadge
                  key={tag.id}
                  tag={tag}
                  onTagClick={() => onTagAssign(tag?.name)}
                  onTagDelete={() => onTagRemove(tag?.id)}
                />
              ) : null}
            </>
          ))}
          <Input
            ref={inputRef}
            name="Tag name"
            onKeyDown={(e) => handleChange(e)}
            onChange={(e) => setTagName(e.target.value)}
            value={tagName}
            placeholder="Enter tag name"
            className="focus-visible:ring-0 focus-visible:ring-transparent"
          />
          <div className="mt-4 flex w-full flex-wrap gap-2">
            {filteredTags?.map((tag) => (
              <Badge
                key={tag.id}
                className="cursor-pointer"
                onClick={() => onTagAssign(tag.id, false)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
