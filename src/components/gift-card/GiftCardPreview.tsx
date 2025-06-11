'use client';

import type { GiftCardData, DesignTemplate } from '@/lib/types';
import { generateGiftCardNumber } from '@/lib/utils';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Gem, Flower2, Leaf } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GiftCardPreviewProps {
  data: GiftCardData;
  designTemplates: DesignTemplate[];
}

const getOccasionIcon = (occasion: string) => {
  if (occasion.toLowerCase().includes('birth')) return <Flower2 className="h-5 w-5 text-primary opacity-70" />;
  if (occasion.toLowerCase().includes('anniver')) return <Gem className="h-5 w-5 text-primary opacity-70" />;
  return <Leaf className="h-5 w-5 text-primary opacity-70" />;
};

export default function GiftCardPreview({ data, designTemplates }: GiftCardPreviewProps) {
  const [cardNumber, setCardNumber] = useState('');

  useEffect(() => {
    setCardNumber(data.cardNumber || generateGiftCardNumber(data));
  }, [data.recipientName, data.amount, data.occasion, data.cardNumber]);

  const selectedDesign = designTemplates.find(dt => dt.id === data.designId) ||
                         (designTemplates.length > 0 ? designTemplates[0] : null) ||
                         { id:'fallback', name: 'Default Design', imageUrl: 'https://picsum.photos/seed/spaRelax/600/370', dataAiHint: 'spa serene' };


  return (
    <Card className="overflow-hidden shadow-lg bg-gradient-to-br from-secondary to-background">
      <div className="relative w-full aspect-[1.618]"> {/* Golden ratio for card */}
        <Image
          src={selectedDesign.imageUrl}
          alt={selectedDesign.name || "Spa Gift Card Background"}
          layout="fill"
          objectFit="cover"
          className="opacity-30"
          data-ai-hint={selectedDesign.dataAiHint || "spa serene"}
          key={selectedDesign.id} // Ensures image re-renders if src changes
        />
        <div className="absolute inset-0 p-6 flex flex-col justify-between bg-black/10">
          {/* Top section */}
          <div>
             <div className="flex justify-between items-start">
                 {/* Display Package Name or Amount */}
                <div className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground drop-shadow-md text-right ml-auto break-words">
                {data.amountType === 'package' && data.selectedPackageName ? (
                    // Display package name if selected
                    <span className="block text-xl md:text-2xl">{data.selectedPackageName}</span>
                ) : (
                     // Display amount if custom or package name not available
                    <span>${data.amount}</span>
                )}
                 {/* Always show amount below if package */}
                 {data.amountType === 'package' && data.selectedPackageName && (
                    <span className="block text-base font-medium opacity-90">(${data.amount})</span>
                 )}
                </div>
            </div>
             {/* Occasion - Placed below amount/package */}
            <p className="text-sm text-primary-foreground/80 mt-1 text-right">{data.occasion}</p>
          </div>

          {/* Middle section */}
          <div className="text-center my-auto"> {/* Centered vertically */}
            <p className="text-lg text-primary-foreground/90">A Special Gift For</p>
            <p className="font-heading text-2xl font-bold text-primary-foreground capitalize truncate drop-shadow-sm">
              {data.recipientName || "Recipient's Name"}
            </p>
          </div>

          {/* Lower-middle section */}
          <div className="text-center">
            {data.message && (
              // Allow wrapping and break words
              <p className="text-sm italic text-primary-foreground/80 mb-2 max-w-xs mx-auto break-words whitespace-pre-wrap">
                {data.message}
              </p>
            )}
            <p className="text-sm text-primary-foreground/90">From: {data.senderName || "Sender's Name"}</p>
          </div>

          {/* Bottom-right icon */}
          <div className="flex justify-end items-center mt-auto pt-4">
             {getOccasionIcon(data.occasion)}
          </div>
        </div>
      </div>
       {/* Bottom Bar */}
      <CardContent className="p-3 bg-card/80">
        <div className="flex items-center space-x-3"> {/* Flex container */}
          {/* Logo Placeholder */}
          <div className="shrink-0"> {/* Prevent shrinking */}
              <Image
                  src="https://picsum.photos/seed/spaLogo/60/40" // Placeholder logo URL
                  alt="Spa Logo Placeholder"
                  width={60}
                  height={40}
                  objectFit="contain" // Adjust as needed
                  className="rounded-sm bg-muted" // Added bg for visibility
                  data-ai-hint="spa logo"
              />
          </div>
          {/* Text Content */}
          <div className="flex-1 text-xs text-muted-foreground space-y-0.5"> {/* Takes remaining space */}
            <p>Redeemable for services and products.</p>
            <p>Card Number: {cardNumber}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
