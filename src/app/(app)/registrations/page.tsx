'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RegistrationsTable from "@/components/registrations/registrations-table"
import { useEffect, useState } from "react";
import type { Registration } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

export default function RegistrationsPage() {
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  useEffect(() => {
    if (!role || !['admin', 'superAdmin', 'coordinator'].includes(role)) {
        setLoading(false);
        return;
    };

    const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const registrationsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Fallback for local dummy data vs Firestore timestamp
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        return {
          id: doc.id,
          ...data,
          createdAt: createdAt,
        } as Registration;
      });
      setAllRegistrations(registrationsData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching registrations: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [role]);
  
  const pendingRegistrations = allRegistrations.filter(r => r.paymentStatus === 'pending');
  const paidRegistrations = allRegistrations.filter(r => r.paymentStatus === 'success');

  if (!role || !['admin', 'superAdmin', 'coordinator'].includes(role)) {
    return (
         <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
    )
  }

  if (loading) {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Registrations</h1>
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-96 w-full" />
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl font-headline">Registrations</h1>
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
           <TabsTrigger value="pending">Pending <Badge variant="secondary" className="ml-2">{pendingRegistrations.length}</Badge></TabsTrigger>
          <TabsTrigger value="paid">Paid ({paidRegistrations.length})</TabsTrigger>
          <TabsTrigger value="all">All ({allRegistrations.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <RegistrationsTable data={allRegistrations} />
        </TabsContent>
        <TabsContent value="pending">
          <RegistrationsTable data={pendingRegistrations} />
        </TabsContent>
        <TabsContent value="paid">
          <RegistrationsTable data={paidRegistrations} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
