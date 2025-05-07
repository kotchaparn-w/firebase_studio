export interface GiftCardData {
  recipientName: string;
  senderName: string;
  message: string;
  amount: number;
  occasion: string;
  design: string; // For now, a placeholder like 'default_spa_design.png' or similar identifier
  deliveryEmail?: string;
  noteToStaff?: string;
}

export const initialGiftCardData: GiftCardData = {
  recipientName: '',
  senderName: '',
  message: '',
  amount: 50,
  occasion: 'Birthday',
  design: 'default_spa_design',
  deliveryEmail: '',
  noteToStaff: '',
};
