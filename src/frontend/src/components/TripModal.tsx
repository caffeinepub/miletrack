import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Trip } from "../backend";
import { useAddTrip, useUpdateTrip } from "../hooks/useQueries";

interface Props {
  open: boolean;
  onClose: () => void;
  editTrip?: Trip | null;
}

export default function TripModal({ open, onClose, editTrip }: Props) {
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [purpose, setPurpose] = useState("");
  const [destination, setDestination] = useState("");
  const [kilometers, setKilometers] = useState("");

  const addTrip = useAddTrip();
  const updateTrip = useUpdateTrip();
  const isPending = addTrip.isPending || updateTrip.isPending;
  const isEdit = !!editTrip;

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset form on open/editTrip changes
  useEffect(() => {
    if (editTrip) {
      setDate(editTrip.date);
      setPurpose(editTrip.purpose);
      setDestination(editTrip.destination);
      setKilometers(String(editTrip.kilometers));
    } else {
      setDate(new Date().toISOString().split("T")[0]);
      setPurpose("");
      setDestination("");
      setKilometers("");
    }
  }, [editTrip, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const km = Number.parseFloat(kilometers);
    if (
      !date ||
      !purpose.trim() ||
      !destination.trim() ||
      Number.isNaN(km) ||
      km <= 0
    ) {
      toast.error("Sabhi fields sahi se bharein");
      return;
    }

    try {
      if (isEdit && editTrip) {
        await updateTrip.mutateAsync({
          id: editTrip.id,
          date,
          purpose: purpose.trim(),
          destination: destination.trim(),
          kilometers: km,
        });
        toast.success("Trip update ho gayi! ✅");
      } else {
        await addTrip.mutateAsync({
          date,
          purpose: purpose.trim(),
          destination: destination.trim(),
          kilometers: km,
        });
        toast.success("Naya safar note ho gaya! 🚗");
      }
      onClose();
    } catch {
      toast.error("Kuch gadbad ho gayi, dobara try karein");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md" data-ocid="trip_modal.dialog">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Trip Edit Karein ✏️" : "Naya Safar Note Karein 🚗"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="trip-date">Kab Gaye (Date)</Label>
            <Input
              id="trip-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              data-ocid="trip_modal.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="trip-purpose">Kaam — Kya Karne Gaye The</Label>
            <Input
              id="trip-purpose"
              placeholder="e.g. Client meeting, Documents lene gaya"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              data-ocid="trip_modal.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="trip-destination">Kahan Gaye (Destination)</Label>
            <Input
              id="trip-destination"
              placeholder="e.g. Sector 18, Noida"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              data-ocid="trip_modal.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="trip-km">Kitne KM (Kilometers)</Label>
            <Input
              id="trip-km"
              type="number"
              placeholder="e.g. 12.5"
              min="0.1"
              step="0.1"
              value={kilometers}
              onChange={(e) => setKilometers(e.target.value)}
              required
              data-ocid="trip_modal.input"
            />
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="trip_modal.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="trip_modal.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Save ho raha hai...
                </>
              ) : isEdit ? (
                "Update Karein"
              ) : (
                "Safar Note Karein"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
