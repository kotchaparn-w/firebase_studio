
'use client';

import React, { useState, useEffect } from 'react';
import type { GiftCardData } from '@/lib/types';
import { mockPurchasedCards } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Eye, Filter, Download, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';

// In a real app with MongoDB:
// 1. Define a Mongoose schema for GiftCardData.
// 2. Create API routes (e.g., /api/admin/giftcards) to fetch data from MongoDB.
//    - GET /api/admin/giftcards: Fetch all or paginated gift cards.
//    - GET /api/admin/giftcards/[id]: Fetch a specific gift card.
//    - POST /api/admin/giftcards: Create a new gift card (likely done on customer checkout).
//    - PUT /api/admin/giftcards/[id]: Update a gift card (e.g., status).
// 3. Use a data fetching library (like SWR or React Query) on this page to call these API routes.

export default function PurchasedCardsPage() {
  const [purchasedCards, setPurchasedCards] = useState<GiftCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  type CardStatus = NonNullable<GiftCardData['status']>;
  const initialStatusFilter: Record<CardStatus, boolean> = {
    active: true,
    redeemed: true,
    expired: true,
  };
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching data. Replace with actual API call to MongoDB backend.
    // In a real scenario, you might also fetch cards saved by checkout process.
    const storedPurchases = localStorage.getItem('mockPurchasedCards');
    const allCards = storedPurchases ? [...mockPurchasedCards, ...JSON.parse(storedPurchases)] : mockPurchasedCards;
    // Remove duplicates by ID if any from mock and localStorage merge
    const uniqueCards = Array.from(new Map(allCards.map(card => [card.id || card.cardNumber, card])).values());

    setTimeout(() => {
      setPurchasedCards(uniqueCards);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredCards = purchasedCards.filter(card => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      (card.cardNumber?.toLowerCase().includes(lowerSearchTerm)) ||
      (card.recipientName.toLowerCase().includes(lowerSearchTerm)) ||
      (card.senderName.toLowerCase().includes(lowerSearchTerm)) ||
      (card.deliveryEmail?.toLowerCase().includes(lowerSearchTerm)) ||
      (card.senderEmail?.toLowerCase().includes(lowerSearchTerm)); // Added senderEmail search

    const matchesStatus = card.status ? statusFilter[card.status] : true;

    return matchesSearch && matchesStatus;
  });

  const handleStatusFilterChange = (status: CardStatus) => {
    setStatusFilter(prev => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleExport = () => {
    const dataToExport = JSON.stringify(filteredCards, null, 2);
    const blob = new Blob([dataToExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchased_gift_cards.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Data Exported", description: "Purchased cards data (JSON) download initiated." });
  };

  const handleViewDetails = (card: GiftCardData) => {
    // For a real app, this might open a modal with more comprehensive details
    // or navigate to a dedicated detail page: /admin/purchased-cards/[cardId]
    const details = `
      Card #: ${card.cardNumber || 'N/A'}
      Recipient: ${card.recipientName}
      Recipient Email: ${card.deliveryEmail || 'N/A (Download only)'}
      Sender: ${card.senderName}
      Sender Email: ${card.senderEmail}
      Amount: $${card.amount.toFixed(2)}
      Occasion: ${card.occasion}
      Message: ${card.message || 'None'}
      Design ID: ${card.designId}
      Purchase Date: ${card.purchaseDate ? new Date(card.purchaseDate).toLocaleDateString() : 'N/A'}
      Status: ${card.status || 'N/A'}
      Note to Staff: ${card.noteToStaff || 'None'}
      Payment Last 4: ${card.paymentMethodLast4 || 'N/A'}
    `;
    alert(`Gift Card Details:\n${details}`);
  };


  if (isLoading) {
    return (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-heading font-bold text-3xl text-primary">Purchased Gift Cards</CardTitle>
          <CardDescription>Loading records of all purchased gift cards...</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Fetching data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-heading font-bold text-3xl text-primary">Purchased Gift Cards</CardTitle>
              <CardDescription>View and manage records of all purchased gift cards. Data is currently mocked.</CardDescription>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by card #, name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto shrink-0">
                  <Filter className="mr-2 h-4 w-4" /> Filter by Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Card Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(statusFilter) as Array<CardStatus>).map((statusKey) => (
                   <DropdownMenuCheckboxItem
                    key={statusKey}
                    checked={statusFilter[statusKey]}
                    onCheckedChange={() => handleStatusFilterChange(statusKey)}
                  >
                    {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filteredCards.length > 0 ? (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableCaption>A list of purchased gift cards. {/* TODO: Add pagination if using real DB */}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Card #</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Sender Email</TableHead> {/* Added Sender Email column */}
                    <TableHead className="text-right w-[80px]">Amount</TableHead>
                    <TableHead className="w-[120px]">Occasion</TableHead>
                    <TableHead className="w-[120px]">Purchase Date</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>Recipient Email</TableHead> {/* Renamed from Delivery */}
                    <TableHead className="text-center w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCards.map((card) => (
                    <TableRow key={card.id || card.cardNumber}>
                      <TableCell className="font-medium truncate">{card.cardNumber || 'N/A'}</TableCell>
                      <TableCell className="truncate">{card.recipientName}</TableCell>
                      <TableCell className="truncate">{card.senderName}</TableCell>
                      <TableCell className="truncate">{card.senderEmail}</TableCell> {/* Added Sender Email cell */}
                      <TableCell className="text-right">${card.amount.toFixed(2)}</TableCell>
                      <TableCell className="truncate">{card.occasion}</TableCell>
                      <TableCell>{card.purchaseDate ? new Date(card.purchaseDate).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>
                        {card.status && (
                          <Badge variant={card.status === 'active' ? 'default' : card.status === 'redeemed' ? 'secondary' : 'destructive'} className="capitalize">
                            {card.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="truncate">{card.deliveryEmail ? card.deliveryEmail : 'N/A'}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(card)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            {/* Add other actions like 'Mark Redeemed', 'Resend Email' etc. later */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-border rounded-lg">
              <p className="text-lg font-medium">No gift cards match your criteria.</p>
              {searchTerm && <p className="text-sm">Try adjusting your search or filters.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

