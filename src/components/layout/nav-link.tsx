'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
  isMobile?: boolean;
}

export default function NavLink({ href, icon: Icon, children, className, isMobile = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (isMobile) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                isActive && "bg-muted text-foreground",
                className
            )}
        >
            <Icon className="h-5 w-5" />
            {children}
        </Link>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary font-semibold",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
};
