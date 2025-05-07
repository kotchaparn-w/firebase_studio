import type { DesignTemplate, GiftCardData } from './types';
import { generateGiftCardNumber } from './utils';

export const initialDesignTemplates: DesignTemplate[] = [
  { id: 'template1', name: 'Serene Bloom', imageUrl: 'https://picsum.photos/seed/templateA/600/370', dataAiHint: 'floral pattern', featuredOccasion: 'Birthday' },
  { id: 'template2', name: 'Calm Waters', imageUrl: 'https://picsum.photos/seed/templateB/600/370', dataAiHint: 'water ripple' },
  { id: 'template3', name: 'Zen Stones', imageUrl: 'https://picsum.photos/seed/templateC/600/370', dataAiHint: 'stacked stones', featuredOccasion: 'Just Because' },
  { id: 'template4', name: 'Golden Celebration', imageUrl: 'https://picsum.photos/seed/templateD/600/370', dataAiHint: 'gold abstract', featuredOccasion: 'Anniversary' },
];

const samplePurchasedCardBase1: Omit<GiftCardData, 'cardNumber' | 'id' | 'purchaseDate' | 'status' | 'paymentMethodLast4'> = {
  recipientName: "Alice Wonderland",
  senderName: "Mad Hatter",
  message: "A very merry unbirthday to you!",
  amount: 100,
  occasion: "Unbirthday",
  designId: "template1",
  deliveryEmail: "alice@example.com",
  noteToStaff: "Prefers Earl Grey tea.",
};

const samplePurchasedCardBase2: Omit<GiftCardData, 'cardNumber' | 'id' | 'purchaseDate' | 'status' | 'paymentMethodLast4'> = {
  recipientName: "Bob The Builder",
  senderName: "Wendy",
  message: "Thanks for all your help!",
  amount: 50,
  occasion: "Thank You",
  designId: "template2",
  noteToStaff: "Ensure access for construction boots.",
};

const samplePurchasedCardBase3: Omit<GiftCardData, 'cardNumber' | 'id' | 'purchaseDate' | 'status' | 'paymentMethodLast4'> = {
  recipientName: "Charlie Brown",
  senderName: "Snoopy",
  message: "Good grief, have a good day!",
  amount: 25,
  occasion: "Just Because",
  designId: "template3",
  deliveryEmail: "charlie@example.com",
};

export const mockPurchasedCards: GiftCardData[] = [
  {
    ...samplePurchasedCardBase1,
    id: 'purchase_1',
    cardNumber: generateGiftCardNumber(samplePurchasedCardBase1),
    purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0], // 7 days ago
    status: 'active',
    paymentMethodLast4: "1234",
  },
  {
    ...samplePurchasedCardBase2,
    id: 'purchase_2',
    cardNumber: generateGiftCardNumber(samplePurchasedCardBase2),
    purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0], // 2 days ago
    status: 'redeemed',
    paymentMethodLast4: "5678",
  },
  {
    ...samplePurchasedCardBase3,
    id: 'purchase_3',
    cardNumber: generateGiftCardNumber(samplePurchasedCardBase3),
    purchaseDate: new Date().toISOString().split('T')[0], // Today
    status: 'active',
    paymentMethodLast4: "9012",
  }
];
