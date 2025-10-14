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
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Logo from "@/components/logo";
import Link from "next/link";
import { eventsByDay } from "@/lib/events";

type EventDay = 'Day 1' | 'Day 2';

export default function PublicRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDay, setSelectedDay] = useState<EventDay>('Day 1');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const { toast } = useToast();

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
        registeredBy: 'public', // Differentiate public registrations
      });

      toast({
          title: "Registration Submitted!",
          description: "Your registration has been received. Please proceed to the counter for payment.",
      });
      setIsSuccess(true);
      form.reset();
      setSelectedDay('Day 1');
      setSelectedEvents([]);
    } catch (error) {
       console.error("Error adding document: ", error);
       toast({
         title: "Registration Failed",
         description: "Could not save registration. Please try again or see staff for help.",
         variant: "destructive"
       });
    } finally {
        setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-xl mx-auto shadow-lg text-center">
                <CardHeader>
                    <div className="mx-auto mb-4">
                        <Logo />
                    </div>
                    <CardTitle className="font-headline text-2xl text-green-600">Registration Successful!</CardTitle>
                    <CardDescription>
                        Thank you for registering. Your details have been submitted.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-lg">Please proceed to the registration counter to complete your payment and receive your ticket.</p>
                    <Button onClick={() => setIsSuccess(false)}>Register Another Person</Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <Logo />
            </div>
            <CardTitle className="font-headline text-3xl">Event Registration</CardTitle>
            <CardDescription>Enter your details below to register for the event. Payment will be collected at the counter.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="Arun Kumar" required disabled={isLoading} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="9876543210" required disabled={isLoading}/>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="arun@example.com" required disabled={isLoading}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="college">College/Institution</Label>
                <Input id="college" name="college" placeholder="JIT" required disabled={isLoading}/>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-day">Event Day</Label>
                  <Select 
                    name="eventDay" 
                    required 
                    value={selectedDay} 
                    onValueChange={(value: EventDay) => setSelectedDay(value)}
                    disabled={isLoading}
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
                            id={`public-event-${event}`}
                            checked={selectedEvents.includes(event)}
                            onCheckedChange={() => handleEventSelectionChange(event)}
                            disabled={isLoading}
                          />
                          <Label htmlFor={`public-event-${event}`} className="font-normal cursor-pointer">{event}</Label>
                        </div>
                      )) : (
                        <p className="text-sm text-muted-foreground">Please select an event day.</p>
                      )}
                    </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 items-center">
                <Link href="/login" className="text-sm text-muted-foreground hover:underline">Staff Login</Link>
                <Button type="submit" disabled={isLoading} size="lg">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Registration
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </div>
  );
}
