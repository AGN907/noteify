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

export default function CreateFolderDialog({
  children,
  onCreateFolder,
  defaultName = "",
}: {
  children: React.ReactNode;
  onCreateFolder: (name: string) => void;
  defaultName?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const actionText = defaultName ? "Rename" : "Create";

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>{actionText} folder</DialogHeader>
        <DialogDescription>Enter a name for your folder.</DialogDescription>
        <div className="p-4">
          <Input
            ref={inputRef}
            name="Folder name"
            placeholder="Enter folder name"
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
