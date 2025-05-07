import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-3xl text-primary">Admin Settings</CardTitle>
          <CardDescription>Configure application-wide settings for the gift card system.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            This section is a placeholder for various administrative settings. 
            Future settings could include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Email notification templates</li>
            <li>Payment gateway integration details (e.g., Stripe API keys - securely managed)</li>
            <li>Currency settings</li>
            <li>Minimum/maximum gift card amounts</li>
            <li>Default occasion lists</li>
            <li>Branding options for generated PDFs/emails</li>
            <li>User role management</li>
          </ul>
          <Card className="bg-destructive/10 border-destructive/30">
            <CardHeader>
                <CardTitle className="text-destructive text-lg">Important Security Note</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-destructive-foreground">
                    For security reasons, sensitive information like API keys should be managed through environment variables 
                    or a secure configuration service (e.g., HashiCorp Vault, Google Secret Manager). 
                    Do not expose or make them directly editable here unless proper masking, audit trails, and robust access controls are in place.
                </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
