import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-heading font-bold text-4xl text-primary text-center">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-foreground">
          <p>
            Welcome to The Luxurious Spa's Gift Card service. These terms and conditions outline the rules and regulations for the purchase and use of our gift cards.
          </p>

          <h2 className="font-heading font-bold text-2xl text-primary">1. General Terms</h2>
          <p>
            By purchasing or using a The Luxurious Spa gift card, you agree to these terms and conditions. Gift cards are issued by The Luxurious Spa and can be redeemed for services and products at our physical location.
          </p>

          <h2 className="font-heading font-bold text-2xl text-primary">2. Purchase and Redemption</h2>
          <ul>
            <li>Gift cards can be purchased online through our website or in-person at The Luxurious Spa.</li>
            <li>Gift cards are redeemable for spa services and retail products only.</li>
            <li>Gift cards cannot be exchanged for cash or used to purchase other gift cards.</li>
            <li>The value of the gift card will be deducted from the total cost of your service or product. Any remaining balance can be used for future purchases.</li>
          </ul>

          <h2 className="font-heading font-bold text-2xl text-primary">3. Expiration and Fees</h2>
          <p>
            Our gift cards do not expire. There are no activation, inactivity, or service fees associated with our gift cards.
          </p>

          <h2 className="font-heading font-bold text-2xl text-primary">4. Lost or Stolen Gift Cards</h2>
          <p>
            Treat your gift card like cash. The Luxurious Spa is not responsible for lost, stolen, or damaged gift cards, or for any unauthorized use of the gift card. If you have registered your gift card with us (e.g., through online purchase), we may be able to assist in some circumstances, but replacement is not guaranteed.
          </p>

          <h2 className="font-heading font-bold text-2xl text-primary">5. Delivery</h2>
          <p>
            Electronic gift cards (e-gift cards) will be delivered to the recipient's email address provided at the time of purchase. It is the purchaser's responsibility to ensure the accuracy of the recipient's email address. The Luxurious Spa is not responsible for e-gift cards that are undeliverable or not received due to an incorrect email address, spam filters, or other issues beyond our control.
          </p>
          <p>
            For downloadable PDF gift cards, it is the purchaser's responsibility to download and securely store the PDF.
          </p>

          <h2 className="font-heading font-bold text-2xl text-primary">6. Limitations</h2>
          <p>
            Gift cards may not be resold. Unauthorized resale or attempted resale is grounds for seizure and cancellation without compensation. The Luxurious Spa reserves the right to refuse, cancel, or hold for review gift cards and orders in cases of suspected fraud, mistakenly issued denominations, or other violations of gift card policies.
          </p>

          <h2 className="font-heading font-bold text-2xl text-primary">7. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of [Your State/Jurisdiction], and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>

          <h2 className="font-heading font-bold text-2xl text-primary">8. Changes to Terms</h2>
          <p>
            The Luxurious Spa reserves the right to change these terms and conditions from time to time in its discretion. All terms and conditions are applicable to the extent permitted by law.
          </p>

          <h2 className="font-heading font-bold text-2xl text-primary">Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at [Spa Phone Number] or [Spa Email Address].
          </p>

          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
