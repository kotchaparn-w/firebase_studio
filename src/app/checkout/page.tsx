'use client';

import React, { useState, useEffect, Suspense } from 'react';
import type { GiftCardData } from '@/lib/types';
import { initialGiftCardData } from '@/lib/types';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import PaymentForm from '@/components/checkout/PaymentForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPaymentIntent, confirmPaymentIntent } from '@/services/stripe';
import { sendEmail } from '@/services/email';
import { generateGiftCardPdf } from '@/services/pdf-generator';

function CheckoutPageContent() {
  const [giftCardData, setGiftCardData] = useState<GiftCardData>(initialGiftCardData);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedData = localStorage.getItem('giftCardData');
    if (storedData) {
      try {
        setGiftCardData(JSON.parse(storedData));
      } catch (error) {
        console.error("Failed to parse gift card data from localStorage", error);
        toast({
          title: "Error",
          description: "Could not load your gift card details. Please try again.",
          variant: "destructive",
        });
        router.push('/');
      }
    } else {
        // If no data, redirect to home.
        // This check can be more robust in a real app.
        router.push('/');
    }
  }, [router, toast]);

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    setIsLoading(true);
    try {
      // Step 1: Create Payment Intent
      const paymentIntent = await createPaymentIntent(giftCardData.amount * 100, 'usd'); // amount in cents

      // Step 2: Confirm Payment Intent (mocked)
      // In a real Stripe integration, you'd use paymentIntent.clientSecret on the frontend
      // and then confirm on backend or handle webhooks.
      // Here, we simulate confirmation.
      const confirmedIntent = await confirmPaymentIntent(paymentIntent.id);

      if (confirmedIntent.status === 'succeeded') {
        // Step 3: Generate PDF (mocked)
        const pdfBuffer = await generateGiftCardPdf(
          giftCardData.recipientName,
          giftCardData.message,
          giftCardData.amount,
          giftCardData.occasion,
          giftCardData.noteToStaff || ''
        );
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);


        // Step 4: Send Email (mocked)
        if (giftCardData.deliveryEmail) {
          await sendEmail(
            giftCardData.deliveryEmail,
            `Your Gift Card from ${giftCardData.senderName}`,
            `Dear ${giftCardData.recipientName},\n\nYou have received a gift card for The Luxurious Spa for $${giftCardData.amount}.\n\nMessage: ${giftCardData.message}\n\nOccasion: ${giftCardData.occasion}\n\nEnjoy your luxurious experience!\n\nFrom, ${giftCardData.senderName}`
            // In a real app, you'd attach the PDF or provide a download link
          );
        }
        
        localStorage.removeItem('giftCardData'); // Clear data after successful order
        // Navigate to success page, pass PDF URL and email status
        router.push(`/order-confirmation?pdfUrl=${encodeURIComponent(pdfUrl)}&emailSent=${!!giftCardData.deliveryEmail}`);
        
        toast({
          title: "Payment Successful!",
          description: "Your gift card has been processed.",
        });

      } else {
        throw new Error("Payment confirmation failed.");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!giftCardData.recipientName && !giftCardData.senderName) { // Basic check if data is loaded
    return <div className="text-center py-10">Loading your gift card details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-8 text-center">
        Complete Your Purchase
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckoutSummary data={giftCardData} />
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Payment Details</CardTitle>
            <CardDescription>Enter your payment information below. This is a mock payment form.</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentForm onSubmit={handlePaymentSuccess} isLoading={isLoading} />
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                aria-labelledby="terms-label"
              />
              <Label htmlFor="terms" id="terms-label" className="text-sm text-muted-foreground">
                I agree to the <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80">Terms and Conditions</a>.
              </Label>
            </div>
            <Button 
              type="submit" 
              form="payment-form" // Associates button with PaymentForm's form element
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90" 
              disabled={!termsAccepted || isLoading}
            >
              {isLoading ? 'Processing...' : `Pay $${giftCardData.amount.toFixed(2)}`}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
