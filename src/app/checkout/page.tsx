

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import type { GiftCardData, DesignTemplate } from '@/lib/types';
import { initialGiftCardData } from '@/lib/types';
import { initialDesignTemplates } from '@/lib/mockData';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import PaymentForm from '@/components/checkout/PaymentForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createPaymentIntent, confirmPaymentIntent } from '@/services/stripe';
import { sendEmail } from '@/services/email';
import { generateGiftCardPdf } from '@/services/pdf-generator';
import { generateGiftCardNumber } from '@/lib/utils';

function CheckoutPageContent() {
  const [giftCardData, setGiftCardData] = useState<GiftCardData>(initialGiftCardData);
  const [designTemplates] = useState<DesignTemplate[]>(initialDesignTemplates);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('giftCardData');
    if (storedData) {
      try {
        const parsedData: Partial<GiftCardData> = JSON.parse(storedData); // Parse as partial first

        // Merge with defaults to ensure all fields are present
        const mergedData: GiftCardData = {
          ...initialGiftCardData,
          ...parsedData,
        };

        // Ensure designId has a fallback
        if (!mergedData.designId && designTemplates.length > 0) {
            mergedData.designId = designTemplates[0].id;
        } else if (!mergedData.designId && designTemplates.length === 0) {
            mergedData.designId = 'template1'; // Default fallback
        }
        // Basic validation: Ensure essential fields exist after merge
        if (!mergedData.recipientName || !mergedData.senderName || !mergedData.deliveryEmail || !mergedData.senderEmail) { // Added senderEmail check
           console.warn("Loaded incomplete gift card data, redirecting.");
           throw new Error("Incomplete gift card data.");
        }

        setGiftCardData(mergedData);
      } catch (error) {
        console.error("Failed to parse or validate gift card data from localStorage", error);
        toast({
          title: "Error",
          description: "Could not load your gift card details. Please ensure all required fields were filled.",
          variant: "destructive",
        });
        router.push('/');
      }
    } else {
        // If no data, redirect to home page to start over
        toast({
          title: "No Gift Card Data",
          description: "Please create a gift card first.",
          variant: "destructive",
        });
        router.push('/');
    }
  }, [router, toast, designTemplates]);

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    setIsLoading(true);

    // Ensure emails are present before proceeding (should be caught by form validation, but double-check)
     if (!giftCardData.deliveryEmail || !giftCardData.senderEmail) { // Added senderEmail check
        toast({
            title: "Missing Information",
            description: "Recipient and Sender email are required.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
     }


    const finalGiftCardData: GiftCardData = {
        ...giftCardData,
        id: `gc_${Date.now()}`,
        cardNumber: generateGiftCardNumber(giftCardData),
        purchaseDate: new Date().toISOString(),
        status: 'active',
        paymentMethodLast4: paymentMethodId.length > 4 ? paymentMethodId.slice(-4) : "XXXX"
    };

    try {
      // In a real scenario, you'd create the payment intent *before* confirming it
      // For mock, we'll assume it was created and just need confirmation
      const paymentIntent = await createPaymentIntent(finalGiftCardData.amount * 100, 'usd'); // Mock creating PI
      const confirmedIntent = await confirmPaymentIntent(paymentIntent.id); // Mock confirming PI

      if (confirmedIntent.status === 'succeeded') {

        // Save `finalGiftCardData` to MongoDB via an API call
        // Placeholder: Log and save to localStorage for demo
        console.log("Mock: Gift card data to save to DB:", finalGiftCardData);
        const existingPurchasesString = localStorage.getItem('mockPurchasedCards');
        let existingPurchases: GiftCardData[] = [];
        if(existingPurchasesString) {
            try {
                existingPurchases = JSON.parse(existingPurchasesString);
            } catch(e) {
                console.error("Error parsing mockPurchasedCards from localStorage", e);
                existingPurchases = []; // reset if parsing fails
            }
        }
        // Ensure existingPurchases is an array
        if(!Array.isArray(existingPurchases)) {
            existingPurchases = [];
        }
        localStorage.setItem('mockPurchasedCards', JSON.stringify([...existingPurchases, finalGiftCardData]));


        const pdfBuffer = await generateGiftCardPdf(
          finalGiftCardData.recipientName,
          finalGiftCardData.message,
          finalGiftCardData.amount,
          finalGiftCardData.occasion,
          finalGiftCardData.noteToStaff || '',
          finalGiftCardData.designId,
          finalGiftCardData.cardNumber || 'N/A'
        );
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);


        // Send gift card email to recipient
        await sendEmail(
          finalGiftCardData.deliveryEmail,
          `You've Received a Gift Card from ${finalGiftCardData.senderName}!`,
          `Dear ${finalGiftCardData.recipientName},\n\nYou have received a gift card for The Luxurious Spa for $${finalGiftCardData.amount.toFixed(2)}.\n\nMessage: ${finalGiftCardData.message}\n\nOccasion: ${finalGiftCardData.occasion}\nCard Number: ${finalGiftCardData.cardNumber}\n\nEnjoy your luxurious experience!\n\nFrom, ${finalGiftCardData.senderName}`
          // Consider adding the PDF as an attachment or link
        );

        // Send order confirmation email to sender
        await sendEmail(
          finalGiftCardData.senderEmail,
          `Your Gift Spa Order Confirmation`,
          `Dear ${finalGiftCardData.senderName},\n\nThank you for your purchase! You sent a gift card for $${finalGiftCardData.amount.toFixed(2)} to ${finalGiftCardData.recipientName}.\n\nRecipient Email: ${finalGiftCardData.deliveryEmail}\nOccasion: ${finalGiftCardData.occasion}\nCard Number: ${finalGiftCardData.cardNumber}\n\nWe appreciate your business!`
          // Consider adding the PDF as an attachment or link
        );


        localStorage.removeItem('giftCardData');
         // Pass emailSent=true since it's now mandatory
        router.push(`/order-confirmation?pdfUrl=${encodeURIComponent(pdfUrl)}&emailSent=true`);

        toast({
          title: "Payment Successful!",
          description: "Your gift card has been processed and emailed to the recipient. A confirmation has been sent to your email.",
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

  // Added loading state check
  if (!giftCardData.recipientName && !giftCardData.senderName && !isLoading) {
    return <div className="text-center py-10">Loading your gift card details... If this persists, please return home.</div>;
  }

  const selectedDesign = designTemplates.find(d => d.id === giftCardData.designId) ||
                         (designTemplates.length > 0 ? designTemplates[0] : undefined);


  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-8 text-center">
        Complete Your Purchase
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-heading font-bold text-2xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckoutSummary data={giftCardData} selectedDesign={selectedDesign} />
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-heading font-bold text-2xl">Payment Details</CardTitle>
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
              form="payment-form"
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
