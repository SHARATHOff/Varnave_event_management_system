'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Loader2 } from "lucide-react"
import { useState } from "react"
import type { Registration } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/hooks/use-auth"


interface RegistrationTableRowActionsProps {
  registration: Registration
}

export function RegistrationTableRowActions({ registration }: RegistrationTableRowActionsProps) {
  const { role } = useAuth();
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [ticketId, setTicketId] = useState('')
  const { toast } = useToast()

  // Hide actions for coordinator role - view only access
  if (role === 'coordinator') {
    return null;
  }

  const handleVerifyAndAssign = async () => {
    if (!ticketId) {
      toast({
        title: "Error",
        description: "Please enter a Ticket ID.",
        variant: "destructive",
      })
      return;
    }
    setIsLoading(true);
    try {
      const regDocRef = doc(db, 'registrations', registration.id);
      await updateDoc(regDocRef, {
        paymentStatus: 'success',
        ticketId: ticketId.toUpperCase(),
        checkedIn: false, // Ensure not checked in on assignment
        checkInTime: null,
      });
      toast({
        title: "Success",
        description: `Ticket ${ticketId.toUpperCase()} assigned to ${registration.name}.`,
      });
      setIsVerifyDialogOpen(false);
      setTicketId('');
    } catch (error) {
      console.error("Error updating document:", error);
      toast({
        title: "Error",
        description: "Could not update registration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'registrations', registration.id));
      toast({
        title: "Deleted",
        description: `Registration for ${registration.name} has been deleted.`,
        variant: 'destructive'
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Could not delete registration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {registration.paymentStatus === 'pending' && (
                <DialogTrigger asChild>
                  <DropdownMenuItem>Verify Payment & Assign Ticket</DropdownMenuItem>
                </DialogTrigger>
              )}
               {registration.ticketId && (
                 <DropdownMenuItem onClick={() => navigator.clipboard.writeText(registration.ticketId!)}>
                    Copy Ticket ID
                </DropdownMenuItem>
               )}
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(registration.id)}>
                Copy Registration ID
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />

              {role === 'superAdmin' && (
                <>
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    Delete registration
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Verify/Assign Dialog */}
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Assign Ticket for {registration.name}</DialogTitle>
              <DialogDescription>
                Verify manual payment and assign a pre-printed ticket ID.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ticket-id" className="text-right">
                  Ticket ID
                </Label>
                <Input
                  id="ticket-id"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., TKT001"
                />
              </div>
              <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
                <p><strong>Name:</strong> {registration.name}</p>
                <p><strong>College:</strong> {registration.college}</p>
                <p><strong>Events:</strong> {Array.isArray(registration.eventName) ? registration.eventName.join(', ') : registration.eventName}</p>
                <p><strong>Day:</strong> {registration.eventDay}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleVerifyAndAssign} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & Assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Dialog */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the registration for <strong>{registration.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
