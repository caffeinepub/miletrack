import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveUserProfile } from "../hooks/useQueries";

interface Props {
  open: boolean;
}

export default function ProfileSetupModal({ open }: Props) {
  const [name, setName] = useState("");
  const { mutateAsync, isPending } = useSaveUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await mutateAsync({ name: name.trim() });
      toast.success("Profile save ho gaya! 🎉");
    } catch {
      toast.error("Kuch gadbad ho gayi, dobara try karein");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}
        data-ocid="profile_setup.dialog"
      >
        <DialogHeader>
          <DialogTitle>Aapka Naam Batayein 🙏</DialogTitle>
          <DialogDescription>
            Pehli baar login kar rahe hain? Apna naam enter karein.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name">Aapka Naam</Label>
            <Input
              id="profile-name"
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              data-ocid="profile_setup.input"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || isPending}
            data-ocid="profile_setup.submit_button"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Save ho raha hai...
              </>
            ) : (
              "Save Karein"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
