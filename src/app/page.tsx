'use client';

import React, { useState } from 'react';
import GiftCardForm from '@/components/gift-card/GiftCardForm';
import GiftCardPreview from '@/components/gift-card/GiftCardPreview';
import type { GiftCardData } from '@/lib/types';
import { initialGiftCardData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [giftCardData, setGiftCardData] = useState<GiftCardData>(initialGiftCardData);
  const router = useRouter();

  const handleFormChange = (data: Partial<GiftCardData>) => {
    setGiftCardData(prev => ({ ...prev, ...data }));
  };

  const handleProceedToCheckout = () => {
    // In a real app, you might want to save this data or pass it more securely
    localStorage.setItem('giftCardData', JSON.stringify(giftCardData));
    router.push('/checkout');
  };
  
  // Placeholder for design template management info
  const AdminDesignFeatureInfo = () => (
    <Card className="mt-12 bg-secondary/50 border-dashed">
      <CardHeader>
        <CardTitle className="font-heading text-lg">For Spa Administrators</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-secondary-foreground">
          The upcoming admin panel will allow management of gift card design templates. 
          Customers will be able to choose from these elegant designs to further personalize their gift cards.
        </p>
      </CardContent>
    </Card>
  );


  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
          Craft the Perfect Spa Gift
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Personalize a luxurious spa gift card for someone special. Choose an amount, add a heartfelt message, and select an occasion.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <Card className="sticky top-24 shadow-xl">
           <CardHeader>
            <CardTitle className="font-heading text-3xl">Live Preview</CardTitle>
            <CardDescription>See your gift card design update in real-time.</CardDescription>
          </CardHeader>
          <CardContent>
            <GiftCardPreview data={giftCardData} />
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-heading text-3xl">Customize Your Gift Card</CardTitle>
            <CardDescription>Fill in the details below to create a unique gift.</CardDescription>
          </CardHeader>
          <CardContent>
            <GiftCardForm 
              initialData={giftCardData} 
              onFormChange={handleFormChange} 
              onSubmit={handleProceedToCheckout}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center mt-12">
        <Button size="lg" onClick={handleProceedToCheckout} className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-12 py-6">
          Proceed to Checkout
        </Button>
      </div>
      
      <AdminDesignFeatureInfo />
    </div>
  );
}

