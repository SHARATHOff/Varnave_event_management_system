"use client";

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { exportRegistrationData, ExportRegistrationDataInput } from "@/ai/flows/export-registration-data"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileDown } from "lucide-react"
import { collection, getDocs, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Registration } from "@/lib/types"

export default function ExportPage() {
  const { role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [format, setFormat] = useState<'CSV' | 'Excel'>('CSV');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && role !== 'superAdmin') {
      router.replace('/dashboard');
    }
  }, [role, authLoading, router]);

  const handleExport = async () => {
    setIsExporting(true);
    toast({
      title: 'Exporting Data',
      description: 'Your export is being prepared. This may take a moment...',
    });

    try {
      // Fetch all registrations from Firestore
      const q = query(collection(db, "registrations"));
      const querySnapshot = await getDocs(q);
      const allRegistrations = querySnapshot.docs.map(doc => {
         const data = doc.data();
         // Convert Firestore Timestamps to serializable strings
         const registration: Partial<Registration> & { id: string } = {
           id: doc.id,
           name: data.name,
           phone: data.phone,
           email: data.email,
           college: data.college,
           eventDay: data.eventDay,
           eventName: Array.isArray(data.eventName) ? data.eventName.join(', ') : data.eventName,
           paymentStatus: data.paymentStatus,
           ticketId: data.ticketId,
           checkedIn: data.checkedIn,
           foodCheckedIn: data.foodCheckedIn,
           createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
           checkInTime: data.checkInTime?.toDate ? data.checkInTime.toDate().toISOString() : null,
           foodCheckInTime: data.foodCheckInTime?.toDate ? data.foodCheckInTime.toDate().toISOString() : null,
           registeredBy: data.registeredBy,
         };
         return registration;
      });
      
      const input: ExportRegistrationDataInput = {
        format: format,
        registrationData: allRegistrations, 
      };
      
      const result = await exportRegistrationData(input);
      
      let blob;
      if (format === 'Excel') {
        const byteCharacters = atob(result.fileContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: result.mimeType });
      } else {
         blob = new Blob([result.fileContent], { type: result.mimeType });
      }
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const extension = format === 'CSV' ? 'csv' : 'xlsx';
      link.download = `registrations_export_${new Date().toISOString()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export Complete',
        description: `Your ${format} file has been downloaded.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'Something went wrong while exporting your data.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (authLoading || role !== 'superAdmin') {
    return null;
  }
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl font-headline">Export Data</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="font-headline">Export Registration Data</CardTitle>
          <CardDescription>
            Download a complete report of all participant registrations in your preferred format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Choose Format</Label>
            <RadioGroup 
              defaultValue="CSV" 
              className="flex gap-4"
              value={format}
              onValueChange={(value: 'CSV' | 'Excel') => setFormat(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CSV" id="r1" />
                <Label htmlFor="r1">CSV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Excel" id="r2" />
                <Label htmlFor="r2">Excel (.xlsx)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button onClick={handleExport} disabled={isExporting} className="w-full">
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            {isExporting ? 'Exporting...' : `Export as ${format}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
