'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import type { Registration } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { Button } from "../ui/button";

export default function RecentRegistrations() {
  const [recent, setRecent] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalToday, setTotalToday] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"), limit(5));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recentRegs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
      } as Registration));
      setRecent(recentRegs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching recent registrations:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getUserAvatar = (name: string) => {
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://picsum.photos/seed/${seed}/40/40`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Registrations</CardTitle>
        <CardDescription>
          The latest 5 people to register for the event.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {loading ? (
            Array.from({length: 5}).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="grid gap-1 w-full">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))
        ) : recent.length === 0 ? (
           <div className="text-center text-muted-foreground py-4">
             <p>No registrations yet.</p>
             <Button variant="link" asChild><Link href="/register">Register the first participant</Link></Button>
           </div>
        ) : (
          recent.map(reg => (
            <div key={reg.id} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex" data-ai-hint="person avatar">
                <AvatarImage src={getUserAvatar(reg.name)} alt={reg.name} />
                <AvatarFallback>{getInitials(reg.name)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{reg.name}</p>
                <p className="text-sm text-muted-foreground">{reg.email}</p>
              </div>
              <div className="ml-auto font-medium text-sm capitalize">{reg.paymentStatus}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
