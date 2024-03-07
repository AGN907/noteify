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
  onTagAssign: (title: string, isNew?: boolean) => void;
  onTagRemove: (tagId: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function AssignTagDialog(props: AssignTagDialogProps) {
  const { children, onTagAssign, onTagRemove, ...restProps } = props;
  const [tagTitle, setTagTitle] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const { tags: allTags } = useAppSelector((state) => state.tags);
  const { selectedNoteId, notes } = useAppSelector((state) => state.notes);

  if (!selectedNoteId) return null;

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  if (!selectedNote) return null;

  const selectedTags = selectedNote?.tags.map((tagId) =>
    allTags.find((t) => t.id === tagId),
  );

  const filteredTags = tagTitle
    ? allTags
        .filter(
          (tag) =>
            tag.title.toLowerCase().includes(tagTitle.toLowerCase()) &&
            !selectedTags.some((t) => t?.id === tag.id),
        )
        .slice(0, 10)
    : allTags.filter((tag) => !selectedTags.some((t) => t?.id === tag.id));

  const handleChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (tagTitle && e.key === "Enter") {
      onTagAssign(
        tagTitle,
        !allTags.some(
          ({ title }) => title.toLowerCase() === tagTitle.toLowerCase(),
        ),
      );
      setTagTitle("");
    }
  };

  const renderTagsBadge = () =>
    selectedTags?.map((tag) => {
      if (!tag) return null;
      return (
        <TagBadge
          key={tag?.id}
          tag={tag}
          onTagClick={() => onTagAssign(tag?.title)}
          onTagDelete={() => onTagRemove(tag?.id)}
        />
      );
    });

  return (
    <Dialog {...restProps}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Assign tag</DialogHeader>
        <div className="relative flex flex-wrap gap-2 p-4">
          {renderTagsBadge()}
          <Input
            ref={inputRef}
            name="Tag name"
            onKeyDown={(e) => handleChange(e)}
            onChange={(e) => setTagTitle(e.target.value)}
            value={tagTitle}
            placeholder="Enter tag title"
            className="focus-visible:ring-0 focus-visible:ring-transparent"
          />
          <div className="mt-4 flex w-full flex-wrap gap-2">
            {filteredTags?.map((tag) => (
              <Badge
                key={tag.id}
                className="cursor-pointer"
                onClick={() => onTagAssign(tag.id, false)}
              >
                {tag.title}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
