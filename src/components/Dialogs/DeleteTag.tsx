import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type DeleteTagProps = {
  children: React.ReactNode;
  onDeleteTag: (deleteAllNotes: boolean) => void;
};

export default function DeleteTagDialog(props: DeleteTagProps) {
  const { children, onDeleteTag } = props;
  const checkboxRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this tag?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your tag
        </AlertDialogDescription>
        <div className="mt-6 flex items-center gap-2">
          <Checkbox ref={checkboxRef} />
          <Label>Delete all notes in this tag?</Label>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() =>
                onDeleteTag(checkboxRef.current?.dataset.state === "checked")
              }
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
