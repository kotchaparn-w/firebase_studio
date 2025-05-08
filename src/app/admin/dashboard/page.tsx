import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading font-bold text-3xl text-primary">Admin Dashboard</CardTitle>
          <CardDescription>Overview of gift card activities and system status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Welcome to the Admin Dashboard. This section will provide key metrics and quick access to management tools.
            Currently, this is a placeholder.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Design Templates</CardTitle> {/* Removed font-heading, let CardTitle handle */}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Manage the visual designs available for gift cards.</p>
                <Button asChild variant="outline">
                  <Link href="/admin/design-templates">Go to Designs</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Purchased Cards</CardTitle> {/* Removed font-heading, let CardTitle handle */}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">View records of all gift cards that have been purchased.</p>
                <Button asChild variant="outline">
                  <Link href="/admin/purchased-cards">View Purchases</Link>
                </Button>
              </CardContent>
            </Card>
             <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Settings</CardTitle> {/* Removed font-heading, let CardTitle handle */}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Configure application settings (placeholder).</p>
                <Button asChild variant="outline">
                  <Link href="/admin/settings">Go to Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
