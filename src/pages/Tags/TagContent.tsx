import { useAppSelector } from "@/app/hooks";
import ListItemContainer from "@/components/ListItemContainer";
import Note from "@/components/Note";
import { Button } from "@/components/ui/button";
import { PiArrowLeft } from "react-icons/pi";
import { useLoaderData, useNavigate, type Params } from "react-router-dom";

export async function loader({ params }: { params: Params<"tagId"> }) {
  const { tagId } = params;

  return { tagId };
}

export default function TagContent() {
  const { tagId } = useLoaderData() as { tagId: string | undefined };

  if (!tagId) return <p>Tag not found</p>;

  const { tags } = useAppSelector((state) => state.tags);
  const { notes } = useAppSelector((state) => state.notes);

  const navigate = useNavigate();

  const selectedTag = tags.find((t) => t.id === tagId);

  const tagNotes = notes.filter(
    (note) => note.tags.includes(tagId) && note.type === "note",
  );

  return (
    <div>
      <div className="flex items-center">
        <Button variant="link" size="icon">
          <PiArrowLeft size={24} onClick={() => navigate(-1)} />
        </Button>
        <h1 className="w-64 truncate p-4 text-2xl font-medium">
          {selectedTag?.name}
        </h1>
      </div>
      <hr className="border-t border-accent" />
      {tagNotes.length === 0 && (
        <div className="flex items-center justify-center px-4 pt-32">
          <p>No notes yet. Add this tag to a note to view them here.</p>
        </div>
      )}
      <ListItemContainer
        type="note"
        items={tagNotes}
        renderItem={(item) => <Note item={item} />}
      />
    </div>
  );
}
