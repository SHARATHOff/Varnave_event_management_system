'use client';

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export default function UsersPage() {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== 'superAdmin') {
      router.replace('/dashboard');
    }
  }, [role, loading, router]);

  if (loading || role !== 'superAdmin') {
    return null; // Or a loading/unauthorized component
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl font-headline">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Manage Staff</CardTitle>
          <CardDescription>User roles and access for the event staff are managed in Firebase.</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Developer Note</AlertTitle>
              <AlertDescription>
                To manage users (e.g., add new staff, change roles, reset passwords), please use the Firebase Authentication console. For security, listing and managing users requires a backend Cloud Function which is beyond the scope of this demo application.
              </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
