/**
 * Asynchronously generates a PDF gift card.
 *
 * @param recipientName The name of the gift card recipient.
 * @param message The personalized message on the gift card.
 * @param amount The amount of the gift card.
 * @param occasion The occasion for the gift card.
 * @param noteToStaff A note to the staff (usually not on the PDF itself).
 * @param designId The ID of the selected design template.
 * @param cardNumber The unique gift card number.
 * @returns A promise that resolves to a PDF document as a Buffer.
 */
export async function generateGiftCardPdf(
  recipientName: string,
  message: string,
  amount: number,
  occasion: string,
  noteToStaff: string, // Often for internal use, might not be on PDF
  designId: string,
  cardNumber: string
): Promise<Buffer> {
  // TODO: Implement this by calling a PDF generation API.
  // The API would take these details and use the designId to fetch
  // the correct template image/layout.

  // Placeholder PDF content including new details.
  const textContent = `
    GIFT CARD - THE LUXURIOUS SPA

    To: ${recipientName}
    Amount: $${amount.toFixed(2)}
    Occasion: ${occasion}
    Message: ${message || "Enjoy your gift!"}

    Card Number: ${cardNumber}
    (Design: ${designId}) 

    Redeemable at The Luxurious Spa for services and products.
    Please present this card at the time of service. This card is non-refundable and cannot be exchanged for cash.
  `;
  // noteToStaff is intentionally omitted from customer-facing PDF
  const pdfContent = Buffer.from(`This is a sample PDF gift card.\n\n${textContent}`);
  console.log("Generating PDF with data:", { recipientName, message, amount, occasion, designId, cardNumber });
  return pdfContent;
}
