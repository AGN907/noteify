import { useAppDispatch, useAppSelector } from "@/app/hooks";
import CreateTagDialog from "@/components/Dialogs/CreateTag";
import ListItemContainer from "@/components/ListItemContainer";
import TagItem from "@/components/TagItem";
import { Button } from "@/components/ui/button";
import { addTag } from "@/redux/tags/tagsSlice";
import { PiHash } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export default function TagsList() {
  const { tags } = useAppSelector((state) => state.tags);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleTagCreate = (name: string) => {
    if (!name) return;

    dispatch(addTag({ name }));
  };

  const handleTagClick = (id: string) => {
    navigate(`/tags/${id}`);
  };

  return (
    <div>
      <div className="mb-4 mt-2 flex items-center justify-between px-4">
        <h2 className="text-xl font-semibold">Tags</h2>
        <CreateTagDialog onCreateTag={handleTagCreate}>
          <Button aria-label="Create a tag" variant="link" size="icon">
            <PiHash size={32} />
          </Button>
        </CreateTagDialog>
      </div>
      <div>
        {tags.length < 1 && (
          <div className="flex h-full items-center justify-center">
            <p>No tags yet</p>
          </div>
        )}
        <ListItemContainer
          items={tags}
          renderItem={(tag) => (
            <TagItem tag={tag} handleTagClick={() => handleTagClick(tag.id)} />
          )}
        />
      </div>
    </div>
  );
}
