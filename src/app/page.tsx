'use client';

import React, { useState, useEffect } from 'react';
import GiftCardForm from '@/components/gift-card/GiftCardForm';
import GiftCardPreview from '@/components/gift-card/GiftCardPreview';
import type { GiftCardData, DesignTemplate } from '@/lib/types';
import { initialGiftCardData } from '@/lib/types';
import { initialDesignTemplates } from '@/lib/mockData'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile'; 

export default function HomePage() {
  const [designTemplates, setDesignTemplates] = useState<DesignTemplate[]>(initialDesignTemplates);
  const [giftCardData, setGiftCardData] = useState<GiftCardData>(() => ({
    ...initialGiftCardData,
    designId: initialDesignTemplates.length > 0 ? initialDesignTemplates[0].id : '', 
  }));
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (designTemplates.length > 0 && !designTemplates.find(dt => dt.id === giftCardData.designId)) {
      setGiftCardData(prev => ({ ...prev, designId: designTemplates[0].id }));
    }
  }, [designTemplates, giftCardData.designId]);


  const handleFormChange = (data: Partial<GiftCardData>) => {
    setGiftCardData(prev => ({ ...prev, ...data }));
  };

  const handleProceedToCheckout = () => {
    localStorage.setItem('giftCardData', JSON.stringify(giftCardData));
    router.push('/checkout');
  };
  
  const AdminDesignFeatureInfo = () => (
    <Card className="mt-12 bg-secondary/50 border-dashed">
      <CardHeader>
        <CardTitle className="font-heading text-lg">For Spa Administrators</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-secondary-foreground">
          The admin panel allows management of gift card design templates. 
          Customers can choose from these elegant designs to further personalize their gift cards.
          Admins can also view purchased gift card records.
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
          Personalize a luxurious spa gift card for someone special. Choose an amount, add a heartfelt message, select an occasion, and pick a beautiful design.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <Card className={`${!isMobile ? 'lg:sticky top-24' : ''} shadow-xl`}>
           <CardHeader>
            <CardTitle className="font-heading text-3xl">Live Preview</CardTitle>
            <CardDescription>See your gift card design update in real-time.</CardDescription>
          </CardHeader>
          <CardContent>
            <GiftCardPreview data={giftCardData} designTemplates={designTemplates} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-heading text-3xl">Customize Your Gift Card</CardTitle>
              <CardDescription>Fill in the details below to create a unique gift.</CardDescription>
            </CardHeader>
            <CardContent>
              <GiftCardForm 
                initialData={giftCardData}
                designTemplates={designTemplates}
                onFormChange={handleFormChange} 
                onSubmit={handleProceedToCheckout}
              />
            </CardContent>
          </Card>
          
          {giftCardData.noteToStaff && (
            <Card className="shadow-md border-accent">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-accent">Note for Spa Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">{giftCardData.noteToStaff}</p>
                 <p className="text-xs text-muted-foreground mt-2">(This note is for internal spa use and will not appear on the final gift card given to the recipient.)</p>
              </CardContent>
            </Card>
          )}
        </div>
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
