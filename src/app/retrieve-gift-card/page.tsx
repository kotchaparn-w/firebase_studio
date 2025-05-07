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
import GiftCardPreview from '@/components/gift-card/GiftCardPreview'; // Re-use for display
import type { GiftCardData } from '@/lib/types';

const retrievalSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  lastFourDigits: z.string().length(4, { message: "Please enter the last 4 digits of your card." }).regex(/^\d{4}$/, { message: "Must be 4 digits." }),
});

type RetrievalFormValues = z.infer<typeof retrievalSchema>;

export default function RetrieveGiftCardPage() {
  const [retrievedCard, setRetrievedCard] = useState<GiftCardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<RetrievalFormValues>({
    resolver: zodResolver(retrievalSchema),
    defaultValues: {
      email: '',
      lastFourDigits: '',
    },
  });

  const handleRetrieveCard = async (values: RetrievalFormValues) => {
    setIsLoading(true);
    setRetrievedCard(null); // Clear previous results

    // --- MOCK RETRIEVAL LOGIC ---
    // In a real application, this would involve an API call to a backend
    // that securely queries a database for gift cards matching the email
    // and verifies against a HASH of the last four digits (or a tokenized card reference).
    // NEVER store full credit card numbers.
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    if (values.email === "buyer@example.com" && values.lastFourDigits === "1234") {
      const mockCardData: GiftCardData = {
        recipientName: "Jane Doe (Retrieved)",
        senderName: "John Smith (Buyer)",
        message: "Enjoy this special treat!",
        amount: 75,
        occasion: "Birthday",
        design: "default_spa_design", // Placeholder
        deliveryEmail: "jane.doe@example.com",
        noteToStaff: "Loves lavender scent."
      };
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
    // --- END MOCK RETRIEVAL LOGIC ---
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-heading text-3xl text-center text-primary">Retrieve Your Gift Card</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and the last four digits of the credit card used for purchase.
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
                    <FormLabel>Email Address</FormLabel>
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
                    <FormLabel>Last 4 Digits of Credit Card</FormLabel>
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
          {/* Could add a spinner here */}
        </div>
      )}

      {retrievedCard && !isLoading && (
        <Card className="mt-8 shadow-xl">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-center">Your Gift Card</CardTitle>
          </CardHeader>
          <CardContent>
            <GiftCardPreview data={retrievedCard} />
          </CardContent>
          <CardFooter className="text-center">
             <Button variant="outline" onClick={() => window.print()} className="w-full">Download/Print</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
