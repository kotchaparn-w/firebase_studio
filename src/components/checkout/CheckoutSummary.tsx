'use client';

import type { GiftCardData } from '@/lib/types';

interface CheckoutSummaryProps {
  data: GiftCardData;
}

export default function CheckoutSummary({ data }: CheckoutSummaryProps) {
  return (
    <div className="space-y-4 p-1">
      <h3 className="font-heading text-xl font-semibold text-foreground">Gift Card Details</h3>
      
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Recipient:</span>
          <span className="font-medium text-foreground">{data.recipientName}</span>
        </div>
        <div className="flex justify-between">
          <span>Sender:</span>
          <span className="font-medium text-foreground">{data.senderName}</span>
        </div>
        <div className="flex justify-between">
          <span>Occasion:</span>
          <span className="font-medium text-foreground">{data.occasion}</span>
        </div>
        {data.message && (
          <div>
            <p>Message:</p>
            <blockquote className="mt-1 border-l-2 pl-3 italic text-foreground">
              "{data.message}"
            </blockquote>
          </div>
        )}
        {data.deliveryEmail && (
           <div className="flex justify-between">
            <span>Delivery Email:</span>
            <span className="font-medium text-foreground">{data.deliveryEmail}</span>
          </div>
        )}
         {data.noteToStaff && (
          <div>
            <p>Note to Staff:</p>
            <blockquote className="mt-1 border-l-2 pl-3 italic text-foreground">
              "{data.noteToStaff}"
            </blockquote>
          </div>
        )}
      </div>

      <hr className="my-4 border-border" />

      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-foreground">Total Amount:</span>
        <span className="font-heading text-2xl font-bold text-primary">
          ${data.amount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
