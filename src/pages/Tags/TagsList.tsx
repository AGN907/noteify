import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { CreateTagDialog } from "@/components/Dialogs";
import ListItemContainer from "@/components/ListItemContainer";
import { Button } from "@/components/ui/button";
import { addTag } from "@/redux/tags/tagsSlice";
import { PiHash } from "react-icons/pi";

export default function TagsList() {
  const { tags } = useAppSelector((state) => state.tags);

  const dispatch = useAppDispatch();

  const handleTagCreate = (name: string) => {
    if (!name) return;

    dispatch(addTag({ name }));
  };

  return (
    <div>
      <div className="mb-4 mt-2 flex items-center justify-between px-4 max-xl:pl-14">
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
        <ListItemContainer type="tag" items={tags} />
      </div>
    </div>
  );
}
