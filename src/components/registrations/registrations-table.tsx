import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Registration } from "@/lib/types"
import { RegistrationTableRowActions } from "./registrations-table-row-actions"
import { format } from "date-fns"

interface RegistrationsTableProps {
  data: Registration[];
}

export default function RegistrationsTable({ data }: RegistrationsTableProps) {

  const formatRegistrationDate = (date: any) => {
    if (!date) return 'N/A';
    // It might be a Firestore Timestamp object, or a Date object
    const dateObj = date.toDate ? date.toDate() : date;
    try {
      return format(dateObj, "MMM d, yyyy");
    } catch(e) {
      return 'Invalid Date';
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead className="hidden sm:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">Events</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ticket ID</TableHead>
              <TableHead className="hidden md:table-cell">Registered On</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No results.
                    </TableCell>
                </TableRow>
            ) : data.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell className="font-medium">
                  <div className="font-medium">{registration.name}</div>
                  <div className="text-sm text-muted-foreground">{registration.college}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="font-mono text-sm">{registration.phone}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs">
                    {Array.isArray(registration.eventName) ? registration.eventName.join(', ') : registration.eventName}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={registration.paymentStatus === 'success' ? "default" : "secondary"} 
                    className={
                      registration.paymentStatus === 'success' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                    }
                  >
                    {registration.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">
                    {registration.ticketId || "N/A"}
                </TableCell>
                <TableCell className="hidden md:table-cell">{formatRegistrationDate(registration.createdAt)}</TableCell>
                <TableCell>
                  <RegistrationTableRowActions registration={registration} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
