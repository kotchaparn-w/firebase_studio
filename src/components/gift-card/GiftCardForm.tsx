
'use client';

import React, { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form'; // Import UseFormReturn
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { GiftCardData, DesignTemplate, SpaPackage } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Schema updated to match parent component
const formSchema = z.object({
  recipientName: z.string().min(2, { message: "Recipient's name must be at least 2 characters." }),
  senderName: z.string().min(2, { message: "Sender's name must be at least 2 characters." }),
  message: z.string().max(90, { message: "Message cannot exceed 90 characters." }).optional(),
  amountType: z.enum(['custom', 'package']),
  amount: z.number().positive("Amount must be positive."),
  selectedPackageId: z.string().optional(),
  selectedPackageName: z.string().optional(),
  occasion: z.string().min(1, { message: "Please select an occasion." }),
  designId: z.string().min(1, { message: "Please select a design." }),
  deliveryEmail: z.string().email({ message: "Please enter a valid email for delivery." }).optional().or(z.literal('')),
  noteToStaff: z.string().max(150, { message: "Note to staff cannot exceed 150 characters." }).optional(),
}).refine(data => {
  if (data.amountType === 'custom') {
    return data.amount >= 100 && data.amount <= 800 && (data.amount % 20 === 0);
  }
  return true;
}, {
  message: "Amount must be between $100 and $800, in increments of $20.",
  path: ['amount'],
  params: { dependsOn: 'amountType', value: 'custom' },
}).refine(data => {
   if (data.amountType === 'package') {
     return !!data.selectedPackageId;
   }
   return true;
}, {
  message: "Please select a spa package.",
  path: ['selectedPackageId'],
  params: { dependsOn: 'amountType', value: 'package' },
});


type GiftCardFormValues = z.infer<typeof formSchema>;

interface GiftCardFormProps {
  form: UseFormReturn<GiftCardFormValues>; // Accept form instance as prop
  designTemplates: DesignTemplate[];
  spaPackages: SpaPackage[]; // Receive packages as prop
  isLoadingPackages: boolean; // Receive loading state
  onFormChange: (data: Partial<GiftCardData>) => void;
  // Removed onSubmit prop as it's handled by the parent now
}

const occasions = ["Birthday", "Anniversary", "Thank You", "Congratulations", "Holiday", "Just Because", "Unbirthday"];
const MAX_MESSAGE_LENGTH = 90;
const WARNING_THRESHOLD = 15;

// Use the passed form instance directly
export default function GiftCardForm({ form, designTemplates, spaPackages, isLoadingPackages, onFormChange }: GiftCardFormProps) {

  const watchedAmountType = form.watch('amountType');
  const watchedAmount = form.watch('amount'); // Watch amount for display

  // Keep the effect to notify parent of changes if needed, but preview syncs via watch in parent
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      onFormChange(value as Partial<GiftCardData>);

      // If amountType changes to 'custom', reset package selection and maybe set default custom amount
      if (name === 'amountType' && value.amountType === 'custom') {
        form.setValue('selectedPackageId', undefined);
        form.setValue('selectedPackageName', undefined);
        // Optional: reset amount to default custom value if needed
        form.setValue('amount', 100, { shouldValidate: true });
      }
      // If amountType changes to 'package', clear custom amount validation errors, reset package selection?
       if (name === 'amountType' && value.amountType === 'package') {
         form.clearErrors('amount'); // Clear custom amount errors
         // Optionally reset package selection if needed, or let user choose
         // form.setValue('selectedPackageId', undefined);
         // form.setValue('amount', 0); // Or set based on first package?
       }
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
  const showRemaining = messageLength > 0 || form.formState.isSubmitted; // Show always or after typing


  const handlePackageChange = (packageId: string) => {
      const selectedPkg = spaPackages.find(p => p.id === packageId);
      if (selectedPkg) {
          form.setValue('amount', selectedPkg.price, { shouldValidate: true });
          form.setValue('selectedPackageId', selectedPkg.id);
          form.setValue('selectedPackageName', selectedPkg.name); // Store name
      } else {
          // Handle case where package is not found (e.g., selected 'None')
          form.setValue('amount', 0); // Or some default/error state
          form.setValue('selectedPackageId', undefined);
          form.setValue('selectedPackageName', undefined);
      }
       form.clearErrors('amount'); // Clear custom amount errors when package is chosen
       form.trigger('selectedPackageId'); // Trigger validation for package selection
  };


  return (
    // Use the passed form instance here
    <Form {...form}>
      {/* Using a div as no submit button inside */}
      {/* Increased overall spacing from space-y-8 to space-y-10 */}
      <div className="space-y-10">

        {/* MOVED: Select Theme Field */}
        <FormField
          control={form.control}
          name="designId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select Theme</FormLabel>
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
                          <div className={cn(`cursor-pointer rounded-lg border-2 ${field.value === template.id ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'} overflow-hidden shadow-sm hover:shadow-md transition-all`)}>
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

        {/* Amount Type Selection */}
        <FormField
            control={form.control}
            name="amountType"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel>Choose Amount Type</FormLabel>
                <FormControl>
                    <RadioGroup
                    onValueChange={(value) => {
                        field.onChange(value);
                        // Optionally reset amount/package when switching
                        if (value === 'custom') {
                            form.setValue('selectedPackageId', undefined);
                            form.setValue('selectedPackageName', undefined);
                             // Set to minimum custom amount when switching back
                            form.setValue('amount', 100, { shouldValidate: true });
                        } else {
                            // Reset package and amount when switching to package
                            form.setValue('selectedPackageId', undefined);
                            form.setValue('selectedPackageName', undefined);
                            form.setValue('amount', 0); // Reset amount, user needs to select package
                            form.clearErrors('amount');
                        }
                    }}
                    value={field.value}
                    className="flex flex-col space-y-1"
                    >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="custom" id="amountTypeCustom"/>
                        </FormControl>
                        <FormLabel htmlFor="amountTypeCustom" className="font-normal">
                            Custom Amount ($100 - $800)
                        </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="package" id="amountTypePackage"/>
                        </FormControl>
                         <FormLabel htmlFor="amountTypePackage" className="font-normal">
                            Spa Package
                        </FormLabel>
                    </FormItem>
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
         />

        {/* Conditional Amount Slider */}
        {watchedAmountType === 'custom' && (
            <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
                <FormItem>
                 {/* Display watchedAmount which updates instantly */}
                <FormLabel>Amount: ${watchedAmount}</FormLabel>
                <FormControl>
                    <Slider
                    // Use field.value for the actual state update via field.onChange
                    value={[field.value]}
                    min={100}
                    max={800}
                    step={20}
                    onValueChange={(value) => field.onChange(value[0])} // Updates form state
                    className="py-2"
                    />
                </FormControl>
                <FormDescription>Choose a value between $100 and $800, in $20 increments.</FormDescription>
                {/* Display error message specific to custom amount */}
                 <FormMessage />
                </FormItem>
            )}
            />
        )}

         {/* Conditional Spa Package Selector */}
        {watchedAmountType === 'package' && (
          <FormField
            control={form.control}
            name="selectedPackageId" // Validate this field when type is package
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Spa Package</FormLabel>
                 {isLoadingPackages ? (
                     <Skeleton className="h-10 w-full rounded-md" />
                 ) : spaPackages.length > 0 ? (
                   <Select
                     onValueChange={(value) => {
                       field.onChange(value); // Update selectedPackageId field state
                       handlePackageChange(value); // Update amount and name based on selection
                     }}
                     value={field.value} // Controlled component using form state
                   >
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select a package" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       <SelectGroup>
                         <SelectLabel>Available Packages</SelectLabel>
                         {/* Optional: Add a "None" or placeholder option if needed */}
                         {/* <SelectItem value="__NONE__" disabled>Select a package</SelectItem> */}
                         {spaPackages.map(pkg => (
                           <SelectItem key={pkg.id} value={pkg.id}>
                             {pkg.name} (${pkg.price}) - {pkg.description}
                           </SelectItem>
                         ))}
                       </SelectGroup>
                     </SelectContent>
                   </Select>
                 ) : (
                     <p className="text-sm text-muted-foreground">No spa packages available at the moment.</p>
                 )}
                 <FormMessage />
              </FormItem>
            )}
          />
        )}


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

        {/* MOVED TO TOP */}
        {/* <FormField ... designId ... /> */}


        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personalized Message (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Wishing you a relaxing day!" {...field} rows={3} maxLength={MAX_MESSAGE_LENGTH} />
              </FormControl>
               <FormDescription className="flex justify-between items-center">
                 <span>Maximum {MAX_MESSAGE_LENGTH} characters.</span>
                 {showRemaining ? (
                   <span className={cn(
                       'transition-colors text-xs',
                       remainingChars <= WARNING_THRESHOLD ? 'text-destructive font-medium' : 'text-muted-foreground'
                    )}>
                     {remainingChars} characters remaining
                   </span>
                 ) : <span>{MAX_MESSAGE_LENGTH} characters remaining</span>}
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
              <FormLabel>Recipient's Email (Optional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="recipient@example.com" {...field} />
              </FormControl>
              <FormDescription>Leave blank if you prefer to download and print the gift card yourself.</FormDescription>
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

    