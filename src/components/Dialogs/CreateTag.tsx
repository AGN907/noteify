import { useRef } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

type CreateTagDialogProps = {
  children: React.ReactNode;
  onCreateTag: (name: string) => void;
  defaultName?: string;
};

export default function CreateTagDialog(props: CreateTagDialogProps) {
  const { children, onCreateTag, defaultName = "" } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const actionText = defaultName ? "Rename" : "Create";

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>{actionText} tag</DialogHeader>
        <DialogDescription>Enter a name for your tag.</DialogDescription>
        <div className="p-4">
          <Input
            ref={inputRef}
            name="Tag name"
            placeholder="Enter tag name"
            className="focus-visible:ring-0 focus-visible:ring-transparent"
            defaultValue={defaultName}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => onCreateTag(inputRef.current?.value ?? "")}>
              {actionText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
