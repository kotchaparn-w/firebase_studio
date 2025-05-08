'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Mail } from 'lucide-react';
import Link from 'next/link';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  useEffect(() => {
    const url = searchParams.get('pdfUrl');
    const sent = searchParams.get('emailSent') === 'true';

    if (url) {
      setPdfUrl(decodeURIComponent(url));
    } else {
      // If no PDF URL, something might be wrong, or it's a different kind of confirmation.
      // For this app, it's expected. Redirect if crucial info missing.
      // console.warn("No PDF URL found in query parameters for order confirmation.");
      // router.push('/'); // Optional: redirect if critical info is missing
    }
    setEmailSent(sent);

    // Cleanup Blob URL when component unmounts
    return () => {
      if (url) {
        // Check if the URL is a blob URL before revoking
        if (url.startsWith('blob:')) {
             try {
                URL.revokeObjectURL(decodeURIComponent(url));
             } catch (error) {
                 console.error("Error revoking Object URL:", error);
             }
        }
      }
    };
  }, [searchParams, router]);


  // Improved loading state check
  const isLoading = typeof window !== 'undefined' && (!searchParams.has('pdfUrl') && !searchParams.has('emailSent'));

  if (isLoading) {
      return <div className="text-center py-10">Loading confirmation details...</div>;
  }


  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="shadow-xl text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 rounded-full p-3 w-fit mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="font-heading font-bold text-4xl text-primary">Thank You For Your Order!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your luxurious spa gift card has been successfully processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {emailSent && (
            <div className="flex items-center justify-center space-x-2 p-3 bg-secondary rounded-md">
              <Mail className="h-5 w-5 text-primary" />
              <p className="text-secondary-foreground">The gift card has been sent to the recipient's email address.</p>
            </div>
          )}

          {pdfUrl && (
            <div>
              <p className="mb-2 text-foreground">You can also download a copy of the gift card:</p>
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href={pdfUrl} download={`TheLuxuriousSpa_GiftCard_${Date.now()}.pdf`}>
                  <Download className="mr-2 h-5 w-5" />
                  Download Gift Card PDF
                </a>
              </Button>
            </div>
          )}

          {!emailSent && !pdfUrl && (
            <p className="text-muted-foreground">Your order is confirmed. Details will be available in your account or via email shortly.</p>
          )}

          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              An order confirmation has also been sent to your email address.
              If you have any questions, please contact our support team.
            </p>
          </div>

          <Button variant="outline" asChild className="mt-6">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    // Added Suspense key for potential remount issues
    <Suspense key={Date.now()} fallback={<div className="text-center py-10">Loading confirmation...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
