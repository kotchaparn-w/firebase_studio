'use client';

import React, { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form'; // Import UseFormReturn
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
import { cn } from '@/lib/utils';

// Schema updated to make deliveryEmail mandatory and message length to 90 chars
const formSchema = z.object({
  recipientName: z.string().min(2, { message: "Recipient's name must be at least 2 characters." }),
  senderName: z.string().min(2, { message: "Sender's name must be at least 2 characters." }),
  message: z.string().max(90, { message: "Message cannot exceed 90 characters." }).optional(), // Updated max length
  amount: z.number().min(10, { message: "Amount must be at least $10." }).max(500, { message: "Amount cannot exceed $500." }),
  occasion: z.string().min(1, { message: "Please select an occasion." }),
  designId: z.string().min(1, { message: "Please select a design." }),
  deliveryEmail: z.string().email({ message: "Please enter a valid email for delivery." }), // Mandatory
  noteToStaff: z.string().max(150, { message: "Note to staff cannot exceed 150 characters." }).optional(),
});

type GiftCardFormValues = z.infer<typeof formSchema>;

interface GiftCardFormProps {
  form: UseFormReturn<GiftCardFormValues>; // Accept form instance as prop
  designTemplates: DesignTemplate[];
  onFormChange: (data: Partial<GiftCardData>) => void;
  // Removed onSubmit prop as it's handled by the parent now
}

const occasions = ["Birthday", "Anniversary", "Thank You", "Congratulations", "Holiday", "Just Because", "Unbirthday"];
const MAX_MESSAGE_LENGTH = 90;
const WARNING_THRESHOLD = 15;

// Use the passed form instance directly
export default function GiftCardForm({ form, designTemplates, onFormChange }: GiftCardFormProps) {

  // Keep the effect to notify parent of changes if needed, but preview syncs via watch in parent
  useEffect(() => {
    const subscription = form.watch((value) => {
      onFormChange(value as Partial<GiftCardData>);
    });
    return () => subscription.unsubscribe();
  }, [form, onFormChange]);

  // Ensure default design is set if needed (though parent also handles this)
  useEffect(() => {
    if (!form.getValues('designId') && designTemplates.length > 0) {
      form.setValue('designId', designTemplates[0].id, { shouldValidate: false }); // Avoid redundant validation
    }
  }, [designTemplates, form]);

  const messageValue = form.watch('message') || ''; // Ensure it's a string
  const messageLength = messageValue.length;
  const remainingChars = MAX_MESSAGE_LENGTH - messageLength;
  const showRemaining = messageLength > 0;


  return (
    // Use the passed form instance here
    <Form {...form}>
      {/* The form tag is technically not needed here as there's no submit button *within* this component */}
      {/* Using a div instead, or keep the form tag if structure requires it */}
      <div className="space-y-8">
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
                  // Use field.value directly for controlled component
                  value={[field.value]}
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
              <Select onValueChange={field.onChange} value={field.value} /* Use value prop */ >
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
                    value={field.value} // Use value prop
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
                <Textarea placeholder="e.g., Wishing you a relaxing day!" {...field} rows={3} maxLength={MAX_MESSAGE_LENGTH} />
              </FormControl>
               <FormDescription>
                 {showRemaining ? (
                   <span className={cn(
                       'transition-colors',
                       remainingChars <= WARNING_THRESHOLD ? 'text-accent font-medium' : 'text-muted-foreground'
                    )}>
                     {remainingChars} characters remaining.
                   </span>
                 ) : (
                   `Maximum ${MAX_MESSAGE_LENGTH} characters.`
                 )}
               </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient's Email (for e-delivery)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="recipient@example.com" {...field} />
              </FormControl>
              {/* Removed optional description */}
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

      </div>
    </Form>
  );
}
