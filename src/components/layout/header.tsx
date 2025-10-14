'use client';

import Link from 'next/link';
import {
  Bell,
  CircleUser,
  Home,
  Menu,
  Search,
  Ticket,
  Users,
  QrCode,
  FileDown,
  UserPlus,
  LogOut,
  CreditCard,
  Utensils,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Logo from '../logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import NavLink from './nav-link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();


  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
  
  const navItems = [
      { href: "/dashboard", icon: Home, label: "Dashboard", roles: ['superAdmin', 'admin', 'randomly'] },
      { href: "/registrations", icon: Ticket, label: "Registrations", roles: ['superAdmin', 'admin'] },
      { href: "/register", icon: UserPlus, label: "New Registration", roles: ['superAdmin', 'admin', 'randomly'] },
      { href: "/check-in", icon: QrCode, label: "Event Check-In", roles: ['superAdmin', 'admin'] },
      { href: "/food-check-in", icon: Utensils, label: "Food Check-In", roles: ['superAdmin', 'admin'] },
      { href: "/users", icon: Users, label: "User Management", roles: ['superAdmin'] },
      { href: "/export", icon: FileDown, label: "Export Data", roles: ['superAdmin'] },
  ];

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold mb-4"
            >
              <Logo />
            </Link>
            {navItems.filter(item => item.roles.includes(role || '')).map((item) => (
                <NavLink 
                    key={item.href}
                    href={item.href} 
                    icon={item.icon}
                    isMobile={true}
                    className="mx-[-0.65rem] text-base"
                >
                    {item.label}
                </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        {/* Search can be implemented later */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.displayName || 'User'} />
                <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <p>{user?.displayName}</p>
            <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4"/>
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
