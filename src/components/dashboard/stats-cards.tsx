'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, Ticket, UserCheck, CreditCard } from "lucide-react"
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import type { Registration } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

export default function StatsCards() {
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    unpaid: 0,
    day1: 0,
    day2: 0,
    checkedIn: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "registrations"), (snapshot) => {
      const registrations = snapshot.docs.map(doc => doc.data() as Registration);
      
      const total = registrations.length;
      const paid = registrations.filter(r => r.paymentStatus === 'success').length;
      const unpaid = total - paid;
      const day1 = registrations.filter(r => r.eventDay === 'Day 1').length;
      const day2 = registrations.filter(r => r.eventDay === 'Day 2').length;
      const checkedIn = registrations.filter(r => r.checkedIn).length;

      setStats({ total, paid, unpaid, day1, day2, checkedIn });
      setLoading(false);
    }, (error) => {
      console.error("Error fetching stats:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const cardStats = [
    {
      title: "Total Registrations",
      value: stats.total,
      change: `Day 1: ${stats.day1}, Day 2: ${stats.day2}`,
      icon: Users,
    },
    {
      title: "Paid Registrations",
      value: stats.paid,
      change: `Unpaid: ${stats.unpaid}`,
      icon: CreditCard,
    },
    {
      title: "Checked In",
      value: stats.checkedIn,
      change: `${stats.total > 0 ? ((stats.checkedIn / stats.total) * 100).toFixed(1) : 0}% of total`,
      icon: UserCheck,
    },
     {
      title: "Pending Approval",
      value: stats.unpaid,
      change: `Need payment verification`,
      icon: Ticket,
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {Array.from({length: 4}).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-1/2 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }


  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {cardStats.map((stat, index) => (
        <Card key={index} className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
