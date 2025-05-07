'use client';

import type { GiftCardData } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Gem, Flower2, Leaf } from 'lucide-react'; // Spa themed icons

interface GiftCardPreviewProps {
  data: GiftCardData;
}

// A simple function to pick a decorative icon based on occasion
const getOccasionIcon = (occasion: string) => {
  if (occasion.toLowerCase().includes('birth')) return <Flower2 className="h-5 w-5 text-primary opacity-70" />;
  if (occasion.toLowerCase().includes('anniver')) return <Gem className="h-5 w-5 text-primary opacity-70" />;
  return <Leaf className="h-5 w-5 text-primary opacity-70" />;
};


export default function GiftCardPreview({ data }: GiftCardPreviewProps) {
  return (
    <Card className="overflow-hidden shadow-lg bg-gradient-to-br from-secondary to-background">
      <div className="relative w-full aspect-[1.618]"> {/* Golden ratio for card */}
        <Image
          src="https://picsum.photos/seed/spaRelax/600/370"
          alt="Spa Gift Card Background"
          layout="fill"
          objectFit="cover"
          className="opacity-30"
          data-ai-hint="spa serene"
        />
        <div className="absolute inset-0 p-6 flex flex-col justify-between bg-black/10">
          <div>
            <div className="flex justify-between items-start">
              <h2 className="font-heading text-2xl font-bold text-primary-foreground drop-shadow-sm">
                The Luxurious Spa
              </h2>
              <div className="font-heading text-3xl font-bold text-primary-foreground drop-shadow-md">
                ${data.amount}
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 mt-1">{data.occasion}</p>
          </div>

          <div className="text-center my-4">
            <p className="text-lg text-primary-foreground/90">A Special Gift For</p>
            <p className="font-heading text-2xl font-semibold text-primary-foreground capitalize truncate drop-shadow-sm">
              {data.recipientName || "Recipient's Name"}
            </p>
          </div>
          
          <div className="text-center">
            {data.message && (
              <p className="text-sm italic text-primary-foreground/80 mb-2 truncate max-w-xs mx-auto">
                "{data.message}"
              </p>
            )}
            <p className="text-sm text-primary-foreground/90">From: {data.senderName || "Sender's Name"}</p>
          </div>

          <div className="flex justify-end items-center mt-auto pt-4">
             {getOccasionIcon(data.occasion)}
          </div>
        </div>
      </div>
      <CardContent className="p-4 bg-card/80">
        <div className="text-xs text-muted-foreground">
          <p>Redeemable at The Luxurious Spa for services and products.</p>
          <p>Card ID: GC-{ (data.recipientName?.slice(0,2) || 'XX') + (data.amount || '00') + (data.occasion?.slice(0,2) || 'XX')}-XXXX</p>
          {data.noteToStaff && <p className="mt-1 text-primary/80 italic">Staff Note: {data.noteToStaff}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
