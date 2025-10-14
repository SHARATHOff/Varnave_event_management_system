'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Utensils, XCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import type { Registration } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type ScanStatus = 'idle' | 'loading' | 'success' | 'already_checked_in' | 'not_paid' | 'not_found';

export default function FoodCheckInPage() {
  const [ticketId, setTicketId] = useState('');
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [scannedData, setScannedData] = useState<{ registration: Registration } | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!ticketId) return;
    setStatus('loading');
    setScannedData(null);
    
    try {
      const q = query(collection(db, "registrations"), where("ticketId", "==", ticketId.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setStatus('not_found');
        return;
      }

      const registrationDoc = querySnapshot.docs[0];
      const registration = { id: registrationDoc.id, ...registrationDoc.data() } as Registration;

      if (registration.foodCheckedIn) {
        setStatus('already_checked_in');
        setScannedData({ registration });
        return;
      }
      
      if (registration.paymentStatus !== 'success') {
        setStatus('not_paid');
        setScannedData({ registration });
        return;
      }
      
      const regDocRef = doc(db, 'registrations', registration.id);
      await updateDoc(regDocRef, {
        foodCheckedIn: true,
        foodCheckInTime: new Date(),
      });
      
      const updatedRegDoc = await getDoc(regDocRef);
      const updatedRegistration = { id: updatedRegDoc.id, ...updatedRegDoc.data() } as Registration;

      setStatus('success');
      setScannedData({ registration: updatedRegistration });
      toast({ title: "Food Check-in Successful", description: `${registration.name} can receive their meal.` });

    } catch (error) {
      console.error("Error during food check-in:", error);
      setStatus('idle');
      toast({
        title: "Scan Error",
        description: "An error occurred while verifying the ticket for food.",
        variant: "destructive"
      });
    }
  };

  const getStatusInfo = () => {
    switch(status) {
      case 'success':
        return { icon: CheckCircle2, color: 'text-green-500', message: 'Voucher Valid', description: 'Participant can receive their meal.' };
      case 'already_checked_in':
        return { icon: AlertTriangle, color: 'text-yellow-500', message: 'Food Already Claimed', description: 'This ticket has already been used for food.' };
      case 'not_paid':
        return { icon: XCircle, color: 'text-red-500', message: 'Payment Pending', description: 'Ticket is not active for food voucher.' };
      case 'not_found':
        return { icon: XCircle, color: 'text-red-500', message: 'Invalid Ticket ID', description: 'This ticket does not exist in the system.' };
      default:
        return { icon: Utensils, color: 'text-muted-foreground', message: 'Ready to Scan', description: 'Enter a Ticket ID to verify for food.' };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl font-headline">Participant Food Check-In</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Food Voucher Scanner</CardTitle>
            <CardDescription>Enter the participant's Ticket ID to validate their food voucher.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full bg-muted aspect-square rounded-lg flex items-center justify-center">
              <Utensils className="w-24 h-24 text-muted-foreground/50"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-id">Ticket ID</Label>
              <div className="flex gap-2">
                <Input 
                  id="ticket-id" 
                  placeholder="e.g. TKT123" 
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                  disabled={status === 'loading'}
                />
                <Button onClick={handleScan} disabled={status === 'loading' || !ticketId}>
                  {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Verify'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn("shadow-lg transition-all", 
            status === 'success' && 'bg-green-50 dark:bg-green-900/20 border-green-500',
            (status === 'not_found' || status === 'not_paid') && 'bg-red-50 dark:bg-red-900/20 border-red-500',
            status === 'already_checked_in' && 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500',
        )}>
          <CardHeader>
            <CardTitle className="font-headline">Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center gap-4 h-full pt-0">
             <StatusIcon className={cn("w-24 h-24", statusInfo.color)} />
              <h2 className={cn("text-2xl font-bold font-headline", statusInfo.color)}>{statusInfo.message}</h2>
              <p className="text-muted-foreground">{statusInfo.description}</p>
              
              {status === 'loading' && <Loader2 className="w-16 h-16 animate-spin text-primary" />}

              {scannedData?.registration && (
                <Card className="w-full text-left mt-4 bg-background">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="h-16 w-16" data-ai-hint="person avatar">
                      <AvatarImage src={`https://picsum.photos/seed/${scannedData.registration.name}/64/64`} />
                      <AvatarFallback>{getInitials(scannedData.registration.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">{scannedData.registration.name}</p>
                      <p className="text-sm text-muted-foreground">{scannedData.registration.college}</p>
                      <p className="text-sm text-muted-foreground">Day: {scannedData.registration.eventDay}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
