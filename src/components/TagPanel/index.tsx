import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addTagToNote, removeTagFromNote } from "@/redux/notes/notesSlice";
import { addTag } from "@/redux/tags/tagsSlice";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { AssignTagDialog } from "../Dialogs/";
import type { ExtendedItem } from "../ListItem/types";
import TagBadge from "../TagBadge";
import { Badge } from "../ui/badge";

export default function TagsPanel() {
  const { tags } = useAppSelector((state) => state.tags);
  const { notes, selectedNoteId } = useAppSelector((state) => state.notes);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedNote = notes?.find((n) => n.id === selectedNoteId);

  if (!selectedNote) return null;

  const selectedNoteTags = selectedNote?.tags
    .map((tag) => tags.find((t) => t.id === tag))
    .filter((tag) => tag !== undefined);

  const handleTagCreate = (title: string, isNew: boolean = true) => {
    let id;

    if (isNew) {
      id = uuid();
      dispatch(addTag({ id, title }));
    } else {
      id = title;
    }

    handleTagAssign(id);
  };

  const handleTagAssign = (tagId: string) => {
    dispatch(addTagToNote({ noteId: selectedNoteId!, tagId }));
  };

  const handleTagRemove = (tagId: string | undefined) => {
    if (!tagId) return;

    dispatch(removeTagFromNote({ noteId: selectedNoteId!, tagId }));
  };

  const handleTagClick = (tagId: string | undefined) => {
    if (!tagId) return;

    navigate(`/tags/${tagId}`);
  };

  return (
    <div className="max-lg:w-full max-lg:px-2">
      <div className="space-y-2 lg:px-16">
        <div className="flex space-x-2 overflow-x-auto whitespace-nowrap">
          <TagList
            tags={selectedNoteTags}
            onTagClick={handleTagClick}
            onTagDelete={handleTagRemove}
          />
        </div>
        <AssignTagDialog
          onTagAssign={handleTagCreate}
          onTagRemove={handleTagRemove}
        >
          <Badge className="cursor-pointer">Add New Tag</Badge>
        </AssignTagDialog>
      </div>
    </div>
  );
}

type TagListProps = {
  tags: (ExtendedItem<"tag"> | undefined)[];
  onTagClick: (tagId: string | undefined) => void;
  onTagDelete: (tagId: string | undefined) => void;
};

const TagList = ({ tags, onTagClick, onTagDelete }: TagListProps) => {
  const renderTagsBadge = () =>
    tags?.map((tag) => {
      if (!tag) return null;
      return (
        <TagBadge
          key={tag?.id}
          tag={tag}
          onTagClick={() => onTagClick(tag?.title)}
          onTagDelete={() => onTagDelete(tag?.id)}
        />
      );
    });

  return <>{renderTagsBadge()}</>;
};
