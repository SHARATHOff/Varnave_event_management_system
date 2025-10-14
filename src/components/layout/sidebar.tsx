'use client';

import Link from 'next/link';
import {
  Home,
  Users,
  Ticket,
  QrCode,
  FileDown,
  UserPlus,
  Utensils,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import Logo from '../logo';
import NavLink from './nav-link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { role } = useAuth();
  const pathname = usePathname();

  const navItems = [
      { href: "/dashboard", icon: Home, label: "Dashboard", roles: ['superAdmin', 'admin', 'randomly'] },
      { href: "/registrations", icon: Ticket, label: "Registrations", roles: ['superAdmin', 'admin', 'coordina'] },
      { href: "/certificates", icon: FileText, label: "Generate Certificates", roles: ['superAdmin', 'admintor'] },
      { href: "/register", icon: UserPlus, label: "New Registration", roles: ['superAdmin', 'admin', 'randomly'] },
      { href: "/certificates", icon: FileText, label: "Generate Certificates", roles: ['superAdmin', 'admin'] },
      { href: "/check-in", icon: QrCode, label: "Event Check-In", roles: ['superAdmin', 'admin'] },
      { href: "/food-check-in", icon: Utensils, label: "Food Check-In", roles: ['superAdmin', 'admin'] },
      { href: "/users", icon: Users, label: "User Management", roles: ['superAdmin'] },
      { href: "/export", icon: FileDown, label: "Export Data", roles: ['superAdmin'] },
  ];

  return (
    <div className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Logo />
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.filter(item => item.roles.includes(role || '')).map((item) => (
                <NavLink key={item.href} href={item.href} icon={item.icon}>
                    {item.label}
                </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle className="font-headline">Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
