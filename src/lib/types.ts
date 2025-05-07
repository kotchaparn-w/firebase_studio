export interface DesignTemplate {
  id: string;
  name: string;
  imageUrl: string;
  dataAiHint?: string;
  featuredOccasion?: string; // For "Customize Just Because" feature
}

export interface GiftCardData {
  id?: string; // Optional, will be set for purchased cards (e.g., from DB)
  recipientName: string;
  senderName: string;
  message: string;
  amount: number;
  occasion: string;
  designId: string; // ID of the chosen DesignTemplate
  deliveryEmail?: string;
  noteToStaff?: string;
  cardNumber?: string; // Auto-generated and displayed
  purchaseDate?: string; // For purchased cards
  status?: 'active' | 'redeemed' | 'expired'; // For purchased cards
  paymentMethodLast4?: string; // For purchased cards display
}

export const initialGiftCardData: GiftCardData = {
  recipientName: '',
  senderName: '',
  message: '',
  amount: 50,
  occasion: 'Birthday',
  designId: 'template1', // Default to the ID of the first template in mockData
  deliveryEmail: '',
  noteToStaff: '',
};
