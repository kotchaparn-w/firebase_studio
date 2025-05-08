import type { Metadata } from 'next';
import { Playfair_Display, Lora } from 'next/font/google'; // Import Playfair Display
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

// Initialize Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'], // Include bold weights
  variable: '--font-playfair-display', // Use a new variable name
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});

export const metadata: Metadata = {
  title: 'Gift Spa - Luxurious Spa Gift Cards',
  description: 'Purchase and customize elegant gift cards for The Luxurious Spa.',
  icons: {
    icon: '/favicon.ico', // Placeholder, will not generate favicon.ico
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          lora.variable,
          playfairDisplay.variable // Apply Playfair Display variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
