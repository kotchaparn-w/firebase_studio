'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { GiftCardData, DesignTemplate } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from 'next/image';

const formSchema = z.object({
  recipientName: z.string().min(2, { message: "Recipient's name must be at least 2 characters." }),
  senderName: z.string().min(2, { message: "Sender's name must be at least 2 characters." }),
  message: z.string().max(200, { message: "Message cannot exceed 200 characters." }).optional(),
  amount: z.number().min(10, { message: "Amount must be at least $10." }).max(500, { message: "Amount cannot exceed $500." }),
  occasion: z.string().min(1, { message: "Please select an occasion." }),
  designId: z.string().min(1, { message: "Please select a design." }),
  deliveryEmail: z.string().email({ message: "Please enter a valid email for delivery." }).optional().or(z.literal('')),
  noteToStaff: z.string().max(150, { message: "Note to staff cannot exceed 150 characters." }).optional(),
});

type GiftCardFormValues = z.infer<typeof formSchema>;

interface GiftCardFormProps {
  initialData: GiftCardData;
  designTemplates: DesignTemplate[];
  onFormChange: (data: Partial<GiftCardData>) => void;
  onSubmit: (data: GiftCardData) => void;
}

const occasions = ["Birthday", "Anniversary", "Thank You", "Congratulations", "Holiday", "Just Because", "Unbirthday"];

export default function GiftCardForm({ initialData, designTemplates, onFormChange, onSubmit: handleFormSubmit }: GiftCardFormProps) {
  const form = useForm<GiftCardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: initialData.recipientName || '',
      senderName: initialData.senderName || '',
      message: initialData.message || '',
      amount: initialData.amount || 50,
      occasion: initialData.occasion || 'Birthday',
      designId: initialData.designId || (designTemplates.length > 0 ? designTemplates[0].id : ''),
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

  useEffect(() => {
    if (!form.getValues('designId') && designTemplates.length > 0) {
      form.setValue('designId', designTemplates[0].id);
    }
  }, [designTemplates, form]);


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
          name="designId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Choose a Design</FormLabel>
              {designTemplates.length > 0 ? (
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                  >
                    {designTemplates.map((template) => (
                      <FormItem key={template.id} className="flex items-center space-x-0">
                         <FormControl>
                          <RadioGroupItem value={template.id} id={`design-${template.id}`} className="sr-only" />
                         </FormControl>
                        <FormLabel htmlFor={`design-${template.id}`} className="w-full">
                          <div className={`cursor-pointer rounded-lg border-2 ${field.value === template.id ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'} overflow-hidden shadow-sm hover:shadow-md transition-all`}>
                            <div className="relative aspect-[1.618] w-full bg-muted">
                              <Image src={template.imageUrl} alt={template.name} layout="fill" objectFit="cover" data-ai-hint={template.dataAiHint || 'card design'} />
                            </div>
                            <p className="text-xs font-medium p-2 text-center bg-background/80 truncate">{template.name}</p>
                          </div>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
              ) : (
                <FormDescription>No designs available at the moment. A default design will be used.</FormDescription>
              )}
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
              <FormDescription>Special requests or preferences for the recipient's visit. This note is for staff only and will not appear on the gift card itself.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
      </form>
    </Form>
  );
}
