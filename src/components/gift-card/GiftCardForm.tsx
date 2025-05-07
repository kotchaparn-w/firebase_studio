'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { GiftCardData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  recipientName: z.string().min(2, { message: "Recipient's name must be at least 2 characters." }),
  senderName: z.string().min(2, { message: "Sender's name must be at least 2 characters." }),
  message: z.string().max(200, { message: "Message cannot exceed 200 characters." }).optional(),
  amount: z.number().min(10, { message: "Amount must be at least $10." }).max(500, { message: "Amount cannot exceed $500." }),
  occasion: z.string().min(1, { message: "Please select an occasion." }),
  deliveryEmail: z.string().email({ message: "Please enter a valid email for delivery." }).optional().or(z.literal('')),
  noteToStaff: z.string().max(150, { message: "Note to staff cannot exceed 150 characters." }).optional(),
});

type GiftCardFormValues = z.infer<typeof formSchema>;

interface GiftCardFormProps {
  initialData: GiftCardData;
  onFormChange: (data: Partial<GiftCardData>) => void;
  onSubmit: (data: GiftCardData) => void;
}

const occasions = ["Birthday", "Anniversary", "Thank You", "Congratulations", "Holiday", "Just Because"];

export default function GiftCardForm({ initialData, onFormChange, onSubmit: handleFormSubmit }: GiftCardFormProps) {
  const form = useForm<GiftCardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: initialData.recipientName || '',
      senderName: initialData.senderName || '',
      message: initialData.message || '',
      amount: initialData.amount || 50,
      occasion: initialData.occasion || 'Birthday',
      deliveryEmail: initialData.deliveryEmail || '',
      noteToStaff: initialData.noteToStaff || '',
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      onFormChange(value as Partial<GiftCardData>);
    });
    return () => subscription.unsubscribe();
  }, [form, onFormChange]);

  const processSubmit = (values: GiftCardFormValues) => {
    handleFormSubmit({ ...initialData, ...values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="recipientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient's Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="senderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sender's Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount: ${field.value}</FormLabel>
              <FormControl>
                <Slider
                  defaultValue={[field.value]}
                  min={10}
                  max={500}
                  step={5}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="py-2"
                />
              </FormControl>
              <FormDescription>Choose a value between $10 and $500.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occasion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occasion</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an occasion" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {occasions.map(occasion => (
                    <SelectItem key={occasion} value={occasion}>{occasion}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personalized Message (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Wishing you a relaxing day!" {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient's Email (for e-delivery, optional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="recipient@example.com" {...field} />
              </FormControl>
              <FormDescription>Leave blank if you prefer to download and print.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="noteToStaff"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note to Spa Staff (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Please ensure a quiet room." {...field} rows={2} />
              </FormControl>
              <FormDescription>Special requests or preferences for the recipient's visit.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* The main submit button is on the parent page (src/app/page.tsx) */}
        {/* This form's onSubmit is triggered by that button if structure allows, or we pass a ref */}
        {/* For simplicity, assuming parent button triggers this form's logic if type="submit" and part of form or handled via React Hook Form's submit handler */}
      </form>
    </Form>
  );
}
