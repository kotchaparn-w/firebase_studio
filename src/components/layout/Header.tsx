
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Gift, Search, ShoppingBag, UserCog } from 'lucide-react'; // Added UserCog for Admin

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          {/* Placeholder for a logo if available, e.g. an SVG icon */}
          {/* <SpaIcon className="h-8 w-8 text-primary" /> */}
          <span className="font-heading text-3xl font-bold text-primary">
            Gift Spa
          </span>
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {/* Buy Gift Card Button */}
          <Button variant="ghost" asChild>
             <Link href="/" className="text-sm sm:text-base flex items-center gap-1 sm:gap-2">
              <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Buy Gift Card</span>
              <span className="sm:hidden">Buy</span>
            </Link>
          </Button>
          {/* Retrieve Card Button */}
          <Button variant="ghost" asChild>
             <Link href="/retrieve-gift-card" className="text-sm sm:text-base flex items-center gap-1 sm:gap-2">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Retrieve Card</span>
              <span className="sm:hidden">Retrieve</span>
            </Link>
          </Button>
           {/* Admin Panel Button */}
           <Button variant="ghost" asChild>
             <Link href="/admin/dashboard" className="text-sm sm:text-base flex items-center gap-1 sm:gap-2">
              <UserCog className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="sm:hidden">Admin</span>
            </Link>
          </Button>
          {/* Cart Button */}
          <Button variant="outline" asChild>
             <Link href="/checkout" className="text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Cart</span>
                <span className="sm:hidden">Cart</span>
                {/* Basic cart item count, can be dynamic later */}
                {/* <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">0</span> */}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

