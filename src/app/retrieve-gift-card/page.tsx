'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import GiftCardPreview from '@/components/gift-card/GiftCardPreview';
import type { GiftCardData, DesignTemplate } from '@/lib/types';
import { initialDesignTemplates } from '@/lib/mockData'; 
import { generateGiftCardNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const retrievalSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  lastFourDigits: z.string().length(4, { message: "Please enter the last 4 digits of your card." }).regex(/^\d{4}$/, { message: "Must be 4 digits." }),
});

type RetrievalFormValues = z.infer<typeof retrievalSchema>;

export default function RetrieveGiftCardPage() {
  const [retrievedCard, setRetrievedCard] = useState<GiftCardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const designTemplates: DesignTemplate[] = initialDesignTemplates;


  const form = useForm<RetrievalFormValues>({
    resolver: zodResolver(retrievalSchema),
    defaultValues: {
      email: '',
      lastFourDigits: '',
    },
  });

  const handleRetrieveCard = async (values: RetrievalFormValues) => {
    setIsLoading(true);
    setRetrievedCard(null); 

    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // In a real app, this would be an API call to your backend.
    // The backend would query MongoDB based on email and a HASH of lastFourDigits or a token.
    // For this mock, we check against predefined values.
    if (values.email.toLowerCase() === "buyer@example.com" && values.lastFourDigits === "1234") {
      const baseMockCardData: Omit<GiftCardData, 'cardNumber' | 'id' | 'purchaseDate' | 'status' | 'paymentMethodLast4'> = {
        recipientName: "Jane Doe (Retrieved)",
        senderName: "John Smith (Buyer)",
        message: "Enjoy this special treat!",
        amount: 75,
        occasion: "Birthday",
        designId: designTemplates[0]?.id || 'template1', 
        deliveryEmail: "jane.doe@example.com", 
        noteToStaff: "Loves lavender scent." 
      };
      const mockCardData: GiftCardData = {
        ...baseMockCardData,
        id: 'retrieved_mock_id_123',
        cardNumber: generateGiftCardNumber(baseMockCardData),
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        status: 'active',
        paymentMethodLast4: '1234'
      }
      setRetrievedCard(mockCardData);
      toast({
        title: "Gift Card Found",
        description: "Displaying your purchased gift card.",
      });
    } else {
      toast({
        title: "Retrieval Failed",
        description: "No gift card found matching your details. Please check your information and try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-heading text-3xl text-center text-primary">Retrieve Your Gift Card</CardTitle>
          <CardDescription className="text-center">
            Enter the email address used for purchase and the last four digits of the payment card.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRetrieveCard)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastFourDigits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last 4 Digits of Payment Card</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="1234" maxLength={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Find Gift Card'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">Searching for your gift card...</p>
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mt-2"></div>
        </div>
      )}

      {retrievedCard && !isLoading && (
        <Card className="mt-8 shadow-xl">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-center">Your Gift Card</CardTitle>
          </CardHeader>
          <CardContent>
            <GiftCardPreview data={retrievedCard} designTemplates={designTemplates} />
             <div className="mt-4 text-sm text-muted-foreground space-y-1 border-t pt-3">
                <p><strong>Status:</strong> <Badge variant={retrievedCard.status === 'active' ? 'default' : 'secondary'} className="capitalize">{retrievedCard.status || 'N/A'}</Badge></p>
                {retrievedCard.purchaseDate && <p><strong>Purchase Date:</strong> {new Date(retrievedCard.purchaseDate).toLocaleDateString()}</p>}
                {retrievedCard.deliveryEmail && <p><strong>Original Delivery Email:</strong> {retrievedCard.deliveryEmail}</p>}
             </div>
          </CardContent>
          <CardFooter className="text-center">
             <Button variant="outline" onClick={() => window.print()} className="w-full">Download/Print</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
