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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast'; // Import useToast

// Define the form schema here, consistent with GiftCardForm
const formSchema = z.object({
  recipientName: z.string().min(2, { message: "Recipient's name must be at least 2 characters." }),
  senderName: z.string().min(2, { message: "Sender's name must be at least 2 characters." }),
  message: z.string().max(90, { message: "Message cannot exceed 90 characters." }).optional(), // Updated max length
  amount: z.number().min(10, { message: "Amount must be at least $10." }).max(500, { message: "Amount cannot exceed $500." }),
  occasion: z.string().min(1, { message: "Please select an occasion." }),
  designId: z.string().min(1, { message: "Please select a design." }),
  deliveryEmail: z.string().email({ message: "Please enter a valid email for delivery." }), // Made mandatory
  noteToStaff: z.string().max(150, { message: "Note to staff cannot exceed 150 characters." }).optional(),
});

type GiftCardFormValues = z.infer<typeof formSchema>;


export default function HomePage() {
  const [designTemplates, setDesignTemplates] = useState<DesignTemplate[]>(initialDesignTemplates);
  // Initialize form state using useForm here
  const form = useForm<GiftCardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialGiftCardData,
      designId: initialDesignTemplates.length > 0 ? initialDesignTemplates[0].id : '',
    },
    mode: 'onChange', // Validate on change/blur for immediate feedback
  });
  // Gift card data for preview is derived from form state
  const [giftCardData, setGiftCardData] = useState<GiftCardData>(form.getValues());
  const router = useRouter();
  const isMobile = useIsMobile();
  const { toast } = useToast(); // Initialize toast

  useEffect(() => {
    // Sync preview data when form values change
    const subscription = form.watch((value) => {
      setGiftCardData(prev => ({ ...prev, ...value }));
    });
    return () => subscription.unsubscribe();
  }, [form]);


  useEffect(() => {
    // Ensure a default design is selected if available
    if (designTemplates.length > 0 && !form.getValues('designId')) {
       form.setValue('designId', designTemplates[0].id, { shouldValidate: true });
    }
  }, [designTemplates, form]);


  const handleFormChange = (data: Partial<GiftCardData>) => {
    // This function might not be strictly needed anymore if preview syncs via watch
    // But we can keep it if GiftCardForm needs to trigger specific updates
     setGiftCardData(prev => ({ ...prev, ...data }));
  };

  const handleProceedToCheckout = async () => {
    // Trigger validation
    const isValid = await form.trigger();

    if (isValid) {
      // Validation passed, proceed
      const currentFormData = form.getValues();
      localStorage.setItem('giftCardData', JSON.stringify(currentFormData));
      router.push('/checkout');
    } else {
      // Validation failed, show toast
      toast({
        title: "Validation Error",
        description: "Please check the form for errors and fill in all required fields.",
        variant: "destructive",
      });
      // Focus on the first error field (optional, requires knowing the field names)
      const firstErrorField = Object.keys(form.formState.errors)[0] as keyof GiftCardFormValues | undefined;
      if (firstErrorField) {
         form.setFocus(firstErrorField);
      }
    }
  };

  const AdminDesignFeatureInfo = () => (
    <Card className="mt-12 bg-secondary/50 border-dashed">
      <CardHeader>
        <CardTitle className="font-heading font-bold text-lg">For Spa Administrators</CardTitle>
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
        <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-primary mb-4">
          Craft the Perfect Spa Gift
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Personalize a luxurious spa gift card for someone special. Choose an amount, add a heartfelt message, select an occasion, and pick a beautiful design.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Preview uses the watched giftCardData state */}
        <div className={`${!isMobile ? 'lg:sticky top-24' : ''} shadow-xl`}>
          <Card>
             <CardHeader>
              <CardTitle className="font-heading font-bold text-3xl">Live Preview</CardTitle>
              <CardDescription>See your gift card design update in real-time.</CardDescription>
            </CardHeader>
            <CardContent>
              <GiftCardPreview data={giftCardData} designTemplates={designTemplates} />
            </CardContent>
          </Card>
         </div>

        <div className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-heading font-bold text-3xl">Customize Your Gift Card</CardTitle>
              <CardDescription>Fill in the details below to create a unique gift.</CardDescription>
            </CardHeader>
            <CardContent>
              <GiftCardForm
                form={form} // Pass the form instance down
                designTemplates={designTemplates}
                onFormChange={handleFormChange} // Keep if needed by form internals
              />
            </CardContent>
          </Card>

          {giftCardData.noteToStaff && (
            <Card className="shadow-md border-accent">
              <CardHeader>
                <CardTitle className="font-heading font-bold text-xl text-accent">Note for Spa Staff</CardTitle>
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
