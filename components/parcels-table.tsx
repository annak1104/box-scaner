import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import type { Parcel } from "@/lib/types";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ParcelStatusBadge } from "./parcel-status-badge";

type ParcelsTableProps = {
  parcels: Parcel[];
  isLoading: boolean;
  error: string | null;
  onUpdateStatus: (parcel: Parcel) => void;
};

export function ParcelsTable({
  error,
  isLoading,
  parcels,
  onUpdateStatus,
}: ParcelsTableProps) {
  return (
    <section className="panel overflow-hidden">
      {error ? (
        <div className="flex items-start gap-3 border-b border-destructive/20 bg-destructive/5 px-4 py-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>TTN</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                Loading parcels...
              </TableCell>
            </TableRow>
          ) : null}

          {!isLoading && parcels.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                No parcels found for this filter set.
              </TableCell>
            </TableRow>
          ) : null}

          {!isLoading
            ? parcels.map((parcel) => (
                <TableRow key={parcel.id}>
                  <TableCell className="font-medium">{parcel.ttn}</TableCell>
                  <TableCell>
                    <ParcelStatusBadge status={parcel.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(parcel.createdAt), "dd.MM.yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateStatus(parcel)}
                    >
                      Update status
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </section>
  );
}
