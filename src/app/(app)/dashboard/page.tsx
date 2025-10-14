import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import StatsCards from "@/components/dashboard/stats-cards";
import OverviewChart from "@/components/dashboard/overview-chart";
import RecentRegistrations from "@/components/dashboard/recent-registrations";

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
      </div>
      <div className="flex flex-1 flex-col gap-4 rounded-lg md:gap-8">
        <StatsCards />
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline">Registrations Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <OverviewChart />
            </CardContent>
          </Card>
          <RecentRegistrations />
        </div>
      </div>
    </div>
  )
}
