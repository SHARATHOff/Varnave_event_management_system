'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { eventsByDay } from "@/lib/events";

type EventDay = 'Day 1' | 'Day 2';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<EventDay>('Day 1');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const availableEvents = useMemo(() => {
    return eventsByDay[selectedDay] || [];
  }, [selectedDay]);

  // Reset selected events when day changes
  useEffect(() => {
    setSelectedEvents([]);
  }, [selectedDay]);

  const handleEventSelectionChange = (eventName: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventName) 
        ? prev.filter(e => e !== eventName)
        : [...prev, eventName]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to register participants.", variant: "destructive" });
        return;
    }
    if (selectedEvents.length === 0) {
        toast({ title: "Validation Error", description: "Please select at least one event.", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await addDoc(collection(db, "registrations"), {
        name: data.name,
        phone: data.phone,
        email: data.email,
        college: data.college,
        eventDay: data.eventDay,
        eventName: selectedEvents,
        paymentStatus: 'pending',
        ticketId: null,
        checkedIn: false,
        checkInTime: null,
        foodCheckedIn: false,
        foodCheckInTime: null,
        createdAt: serverTimestamp(),
        registeredBy: user.uid,
      });

      toast({
          title: "Registration Successful",
          description: `${data.name} has been registered successfully.`,
      });
      form.reset();
      setSelectedDay('Day 1');
      setSelectedEvents([]);
    } catch (error) {
       console.error("Error adding document: ", error);
       toast({
         title: "Registration Failed",
         description: "Could not save registration. Please try again.",
         variant: "destructive"
       });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl font-headline mb-4">New Participant Registration</h1>
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Participant Details</CardTitle>
            <CardDescription>Enter the details for on-site registration. Payment will be marked as pending.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="Arun Kumar" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="9876543210" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="arun@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="college">College/Institution</Label>
                <Input id="college" name="college" placeholder="JIT" required />
              </div>
               <div className="grid gap-2">
                  <Label htmlFor="event-day">Event Day</Label>
                  <Select 
                    name="eventDay" 
                    required 
                    value={selectedDay}
                    onValueChange={(value: EventDay) => setSelectedDay(value)}
                  >
                    <SelectTrigger id="event-day">
                      <SelectValue placeholder="Select event day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Day 1">Day 1</SelectItem>
                      <SelectItem value="Day 2">Day 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Event Name(s)</Label>
                   <div className="grid grid-cols-2 gap-2 rounded-md border p-4">
                      {availableEvents.length > 0 ? availableEvents.map((event) => (
                        <div key={event} className="flex items-center gap-2">
                           <Checkbox
                            id={`event-${event}`}
                            checked={selectedEvents.includes(event)}
                            onCheckedChange={() => handleEventSelectionChange(event)}
                          />
                          <Label htmlFor={`event-${event}`} className="font-normal cursor-pointer">{event}</Label>
                        </div>
                      )) : (
                        <p className="text-sm text-muted-foreground">Please select an event day.</p>
                      )}
                  </div>
                </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register Participant
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </div>
  );
}
