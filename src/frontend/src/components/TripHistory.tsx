import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Trip } from "../backend";
import { useDeleteTrip, useGetTrips } from "../hooks/useQueries";
import TripModal from "./TripModal";

const PAGE_SIZE = 10;

function formatDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TripHistory() {
  const { data: trips = [], isLoading } = useGetTrips();
  const deleteTrip = useDeleteTrip();

  const [editTrip, setEditTrip] = useState<Trip | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [page, setPage] = useState(1);

  const sorted = useMemo(
    () => [...trips].sort((a, b) => b.date.localeCompare(a.date)),
    [trips],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalKm = trips.reduce((s, t) => s + t.kilometers, 0);

  const handleDelete = async () => {
    if (deletingId == null) return;
    try {
      await deleteTrip.mutateAsync(deletingId);
      toast.success("Trip delete ho gayi");
    } catch {
      toast.error("Delete nahi ho payi, dobara try karein");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Safar Ka Itihas 📋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {trips.length} trips · Total {totalKm.toFixed(1)} KM
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 font-semibold"
          data-ocid="history.add_trip.primary_button"
        >
          <Plus className="w-4 h-4" /> Naya Safar
        </Button>
      </motion.div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Sabhi Trips</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="p-6 space-y-3"
              data-ocid="history.table.loading_state"
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div
              className="py-16 text-center"
              data-ocid="history.table.empty_state"
            >
              <MapPin className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                Koi trip nahi mili
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                &quot;Naya Safar&quot; button se pehli trip add karein
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table data-ocid="history.table">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">
                        Tarikh (Date)
                      </TableHead>
                      <TableHead className="font-semibold">
                        Kaam (Purpose)
                      </TableHead>
                      <TableHead className="font-semibold">
                        Kahan Gaye
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        KM
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((trip, idx) => (
                      <TableRow
                        key={trip.id.toString()}
                        className="hover:bg-muted/30 transition-colors"
                        data-ocid={`history.table.row.${idx + 1}`}
                      >
                        <TableCell className="text-sm font-medium">
                          {formatDate(trip.date)}
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px]">
                          <span className="truncate block" title={trip.purpose}>
                            {trip.purpose}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          <span
                            className="truncate block max-w-[160px]"
                            title={trip.destination}
                          >
                            {trip.destination}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-primary text-right">
                          {trip.kilometers.toFixed(1)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => setEditTrip(trip)}
                              data-ocid={`history.table.edit_button.${idx + 1}`}
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeletingId(trip.id)}
                              data-ocid={`history.table.delete_button.${idx + 1}`}
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total & Pagination */}
              <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Total:{" "}
                  <span className="text-primary font-bold">
                    {totalKm.toFixed(1)} KM
                  </span>
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      data-ocid="history.pagination_prev"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      data-ocid="history.pagination_next"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <TripModal open={addOpen} onClose={() => setAddOpen(false)} />
      <TripModal
        open={!!editTrip}
        onClose={() => setEditTrip(null)}
        editTrip={editTrip}
      />

      <AlertDialog
        open={deletingId != null}
        onOpenChange={(v) => !v && setDeletingId(null)}
      >
        <AlertDialogContent data-ocid="history.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Trip delete karein?</AlertDialogTitle>
            <AlertDialogDescription>
              Yeh trip hamesha ke liye delete ho jayegi. Kya aap sure hain?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="history.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="history.delete.confirm_button"
            >
              Haan, Delete Karein
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
