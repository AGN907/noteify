import { PiX } from "react-icons/pi";
import type { ExtendedItem } from "./ListItem/types";
import { Badge } from "./ui/badge";

type TagBadgeProps = {
  tag: ExtendedItem<"tag"> | undefined;
  onTagClick: () => void;
  onTagDelete: () => void;
};

export default function TagBadge(props: TagBadgeProps) {
  const { tag, onTagClick, onTagDelete } = props;

  if (!tag) return null;

  return (
    <div className="relative" aria-label={tag.name + " tag"}>
      <Badge
        onClick={onTagClick}
        variant="outline"
        className="cursor-pointer pr-5"
      >
        {tag.name}
      </Badge>
      <PiX
        aria-label="Remove tag"
        size={12}
        onClick={onTagDelete}
        className="absolute right-1 top-2 cursor-pointer"
      />
    </div>
  );
}
