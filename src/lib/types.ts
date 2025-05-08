

export interface DesignTemplate {
  id: string;
  name: string;
  imageUrl: string;
  dataAiHint?: string;
  featuredOccasion?: string; // For "Customize Just Because" feature
}

export interface SpaPackage {
  id: string;
  name: string;
  description: string;
  price: number;
}


export interface GiftCardData {
  id?: string; // Optional, will be set for purchased cards (e.g., from DB)
  recipientName: string;
  senderName: string;
  senderEmail: string; // Added sender's email
  message: string;
  amount: number; // Final amount, whether custom or from package
  occasion: string;
  designId: string; // ID of the chosen DesignTemplate
  deliveryEmail: string; // Recipient's email, mandatory
  noteToStaff?: string;
  cardNumber?: string; // Auto-generated and displayed
  purchaseDate?: string; // For purchased cards
  status?: 'active' | 'redeemed' | 'expired'; // For purchased cards
  paymentMethodLast4?: string; // For purchased cards display

  // New fields for amount type and package selection
  amountType: 'custom' | 'package';
  selectedPackageId?: string; // ID of the chosen SpaPackage
  selectedPackageName?: string; // Name of the chosen SpaPackage (for display/summary)
}

export const initialGiftCardData: GiftCardData = {
  recipientName: '',
  senderName: '',
  senderEmail: '', // Added sender's email initial value
  message: '',
  amount: 100, // Start at new minimum
  occasion: 'Birthday',
  designId: 'template1', // Default to the ID of the first template in mockData
  deliveryEmail: '', // Recipient's email, mandatory validation
  noteToStaff: '',
  amountType: 'custom', // Default to custom amount
  selectedPackageId: undefined,
  selectedPackageName: undefined,
};

