'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Gift, Search, ShoppingBag } from 'lucide-react';

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
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center space-x-1">
              <Gift className="h-5 w-5" />
              <span className="hidden sm:inline">Buy Gift Card</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/retrieve-gift-card" className="flex items-center space-x-1">
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">Retrieve Card</span>
            </Link>
          </Button>
          <Button variant="outline" asChild>
             <Link href="/checkout" className="flex items-center space-x-1">
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {/* Basic cart item count, can be dynamic later */}
              {/* <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">0</span> */}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

// Placeholder for a custom Spa Icon if needed
// const SpaIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
//     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-3.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm4 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-2.5-4.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
//   </svg>
// );
