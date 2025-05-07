'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'; // Assuming Stripe.js setup

// Mock schema for card details for UI purposes
// In a real Stripe integration, you'd use Stripe Elements for PCI compliance
const paymentSchema = z.object({
  cardName: z.string().min(2, "Name on card is required."),
  // Stripe Elements will handle card number, expiry, CVC
  // Adding dummy fields for layout purposes if not using Stripe Elements directly
  // cardNumber: z.string().length(16, "Card number must be 16 digits.").optional(),
  // expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiry date (MM/YY).").optional(),
  // cvc: z.string().min(3).max(4, "Invalid CVC.").optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onSubmit: (paymentMethodId: string) => Promise<void>; // paymentMethodId from Stripe
  isLoading: boolean;
}

export default function PaymentForm({ onSubmit, isLoading }: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: '',
    },
  });

  // const stripe = useStripe(); // For actual Stripe.js integration
  // const elements = useElements(); // For actual Stripe.js integration

  const handleFormSubmit = async (values: PaymentFormValues) => {
    // This is a mock submission.
    // In a real Stripe integration:
    // if (!stripe || !elements) { return; }
    // const cardElement = elements.getElement(CardElement);
    // if (!cardElement) { return; }
    // const { error, paymentMethod } = await stripe.createPaymentMethod({
    //   type: 'card',
    //   card: cardElement,
    //   billing_details: { name: values.cardName },
    // });
    // if (error || !paymentMethod) {
    //   console.error(error?.message || "Payment method creation failed");
    //   // Handle error display
    //   return;
    // }
    // await onSubmit(paymentMethod.id);

    // Mocking paymentMethodId for now
    await onSubmit("pm_mock_" + Date.now()); 
  };

  const cardElementOptions = {
    style: {
      base: {
        color: 'hsl(var(--foreground))',
        fontFamily: 'var(--font-lora), Arial, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: 'hsl(var(--muted-foreground))',
        },
      },
      invalid: {
        color: 'hsl(var(--destructive))',
        iconColor: 'hsl(var(--destructive))',
      },
    },
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6" id="payment-form">
        <FormField
          control={form.control}
          name="cardName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name on Card</FormLabel>
              <FormControl>
                <Input placeholder="Full Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Stripe Card Element will be used here in a real integration */}
        <FormItem>
          <FormLabel>Card Details</FormLabel>
          {/* 
            This is where <CardElement options={cardElementOptions} /> would go if Stripe.js is fully set up.
            For now, using a placeholder message and a disabled input visual.
          */}
          <div className="p-3 border border-input rounded-md bg-background h-10 flex items-center text-muted-foreground">
            {/* Placeholder for Stripe CardElement */}
            Stripe Card Element will appear here.
          </div>
          <FormDescription className="text-xs">
            Your card details are securely handled by Stripe.
          </FormDescription>
        </FormItem>

        {/* Submit button is outside this component, in checkout/page.tsx */}
        {/* This form will be submitted by that button */}
      </form>
    </Form>
  );
}
