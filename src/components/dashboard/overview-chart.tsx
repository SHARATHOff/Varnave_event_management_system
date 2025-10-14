"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartTooltipContent, ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Registration } from "@/lib/types";
import { format } from "date-fns";

const chartConfig = {
  total: {
    label: "Registrations",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function OverviewChart() {
    const [chartData, setChartData] = useState<{name: string, total: number}[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "registrations"), (snapshot) => {
            const registrations = snapshot.docs.map(doc => doc.data() as Registration);

            const monthlyData = registrations.reduce((acc, reg) => {
                if (reg.createdAt && reg.createdAt.toDate) {
                    const month = format(reg.createdAt.toDate(), 'MMM');
                    acc[month] = (acc[month] || 0) + 1;
                }
                return acc;
            }, {} as Record<string, number>);

            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            
            const formattedData = months.map(month => ({
                name: month,
                total: monthlyData[month] || 0
            }));
            
            setChartData(formattedData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching chart data:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading || !chartData.length) {
        // You can return a skeleton loader here if you want
        return null;
    }

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                />
                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
    )
}
