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

type DeleteFolderProps = {
  children?: React.ReactNode;
  onDeleteFolder: (deleteAllNotes: boolean) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function DeleteFolderDialog(props: DeleteFolderProps) {
  const { children, onDeleteFolder, ...restProps } = props;
  const checkboxRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog {...restProps}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this folder?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your folder
        </AlertDialogDescription>
        <div className="mt-6 flex items-center gap-2">
          <Checkbox ref={checkboxRef} />
          <Label>Delete all notes in this folder?</Label>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() =>
                onDeleteFolder(checkboxRef.current?.dataset.state === "checked")
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
