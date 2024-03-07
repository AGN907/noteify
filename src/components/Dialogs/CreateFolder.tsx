import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

type CreateFolderDialogProps = {
  children?: React.ReactNode;
  onCreateFolder: (title: string) => void;
  defaultName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function CreateFolderDialog(props: CreateFolderDialogProps) {
  const { children, onCreateFolder, defaultName = "", ...restProps } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const actionText = defaultName ? "Rename" : "Create";

  return (
    <Dialog {...restProps}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>{actionText} folder</DialogHeader>
        <DialogDescription>Enter a title for your folder.</DialogDescription>
        <div className="p-4">
          <Input
            ref={inputRef}
            name="Folder title"
            placeholder="Enter folder title"
            className="focus-visible:ring-0 focus-visible:ring-transparent"
            defaultValue={defaultName}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => onCreateFolder(inputRef.current?.value ?? "")}
            >
              {actionText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
