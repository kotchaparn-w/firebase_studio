'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { LayoutDashboard, Image as ImageIcon, ListOrdered, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';


const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/design-templates', label: 'Design Templates', icon: ImageIcon },
  { href: '/admin/purchased-cards', label: 'Purchased Cards', icon: ListOrdered },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.20))]"> {/* Adjust min-height based on header height */}
      <aside className="w-64 border-r p-4 space-y-4 bg-muted/40 hidden md:block">
        <h2 className="font-heading text-2xl text-primary mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && item.href !== '/admin/settings' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} passHref legacyBehavior>
                <a
                  className={cn(
                    buttonVariants({ variant: isActive ? 'secondary' : 'ghost' }),
                    "w-full justify-start",
                    isActive && "font-semibold text-primary"
                  )}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Mobile Navigation */}
        <div className="md:hidden mb-6">
            <Select value={pathname} onValueChange={(value) => router.push(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Navigate Admin Section" />
                </SelectTrigger>
                <SelectContent>
                    {adminNavItems.map(item => (
                        <SelectItem key={item.href} value={item.href}>
                            <div className="flex items-center">
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        {children}
      </main>
    </div>
  );
}
