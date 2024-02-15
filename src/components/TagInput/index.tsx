import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addTagToNote, removeTagFromNote } from "@/redux/notes/notesSlice";
import { addTag } from "@/redux/tags/tagsSlice";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { Item, Tag } from "../ListItem/types";
import TagBadge from "../TagBadge";
import { Input } from "../ui/input";

export default function TagInput() {
  const [tagValue, setTagValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { tags } = useAppSelector((state) => state.tags);
  const { notes, selectedNoteId } = useAppSelector((state) => state.notes);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedNote = notes[selectedNoteId ?? ""];

  const isOldTag = tags.some(
    (tag) => tag.name.toLowerCase() === tagValue.toLowerCase(),
  );

  const filteredTags = tags
    .filter((tag) => !selectedNote.tags.includes(tag.id))
    .slice(0, 5);

  const selectedNoteTags = selectedNote.tags
    .map((tag) => tags.find((t) => t.id === tag))
    .filter((tag) => tag !== undefined);

  const handleTagCreate = () => {
    console.log(isOldTag);
    if (!tagValue) return;

    if (isOldTag) {
      toast.error("Tag already exists");
      return;
    }

    const id = uuid();
    dispatch(addTag({ id, name: tagValue }));

    handleTagAssign(id);
  };

  const handleTagAssign = (tagId: string) => {
    dispatch(addTagToNote({ noteId: selectedNoteId!, tagId }));

    inputRef.current?.focus();

    setTagValue("");
  };

  const handleTagRemove = (tagId: string | undefined) => {
    if (!tagId) return;

    dispatch(removeTagFromNote({ noteId: selectedNoteId!, tagId }));

    inputRef.current?.focus();
  };

  const handleTagClick = (tagId: string | undefined) => {
    if (!tagId) return;

    navigate(`/tags/${tagId}`);
  };

  return (
    <div className="relative left-[13rem] top-20 pb-10">
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          {selectedNoteTags.map((tag) => (
            <TagBadge
              key={tag?.id}
              tag={tag!}
              onTagClick={() => handleTagClick(tag?.id)}
              onTagDelete={() => handleTagRemove(tag?.id)}
            />
          ))}
        </div>
        <Input
          ref={inputRef}
          value={tagValue}
          onChange={(e) => setTagValue(e.target.value)}
          placeholder="Add tag"
          className="peer h-5 w-full border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent"
        />
        <TagMenu
          newTagValue={tagValue}
          isOldTag={isOldTag}
          tags={filteredTags}
          onTagCreate={handleTagCreate}
          onTagAssign={handleTagAssign}
        />
      </div>
    </div>
  );
}

type TagMenuProps = {
  newTagValue: string;
  isOldTag: boolean;
  tags: Item<Tag>[];
  onTagCreate: () => void;
  onTagAssign: (tagId: string) => void;
};

function TagMenu(props: TagMenuProps) {
  const { newTagValue, isOldTag, tags, onTagCreate, onTagAssign } = props;

  return (
    <div className="absolute left-0 right-0 top-8 z-40 hidden peer-focus:block">
      <div className="w-52 rounded-lg bg-slate-100">
        <ul>
          {newTagValue && !isOldTag && (
            <TagListItem
              name={`Create "${newTagValue}"`}
              onTagClick={onTagCreate}
            />
          )}
          <TagList
            tags={
              newTagValue
                ? tags.filter((tag) => tag.name === newTagValue)
                : tags
            }
            onTagClick={onTagAssign}
          />
        </ul>
      </div>
    </div>
  );
}

function TagList({
  tags,
  onTagClick,
}: {
  tags: Item<Tag>[];
  onTagClick: (tagId: string) => void;
}) {
  return (
    <ul>
      {tags.map((tag) => (
        <TagListItem
          key={tag.id}
          name={tag.name}
          onTagClick={() => onTagClick(tag.id)}
        />
      ))}
    </ul>
  );
}

type TagListItemProps = {
  name: string;
  onTagClick: () => void;
};
function TagListItem(props: TagListItemProps) {
  const { name, onTagClick: handleTagClick } = props;

  return (
    <li
      onMouseDown={handleTagClick}
      className="w-full cursor-pointer px-2 py-1 hover:bg-slate-200"
    >
      <span className="text-sm">{name}</span>
    </li>
  );
}
