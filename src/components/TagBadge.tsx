import { PiX } from "react-icons/pi";
import type { Item, Tag } from "./ListItem/types";
import { Badge } from "./ui/badge";

type TagBadgeProps = {
  tag: Item<Tag> | undefined;
  onTagClick: () => void;
  onTagDelete: () => void;
};

export default function TagBadge(props: TagBadgeProps) {
  const { tag, onTagClick, onTagDelete } = props;

  if (!tag) return null;

  return (
    <div className="relative">
      <Badge onClick={onTagClick} variant="outline" className="pr-5">
        {tag.name}
      </Badge>
      <PiX size={12} onClick={onTagDelete} className="absolute right-1 top-2" />
    </div>
  );
}