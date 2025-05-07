'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";

// Mock data for templates
const mockTemplates = [
  { id: 'template1', name: 'Serene Bloom', imageUrl: 'https://picsum.photos/seed/templateA/300/185', dataAiHint: 'floral pattern' },
  { id: 'template2', name: 'Calm Waters', imageUrl: 'https://picsum.photos/seed/templateB/300/185', dataAiHint: 'water ripple' },
  { id: 'template3', name: 'Zen Stones', imageUrl: 'https://picsum.photos/seed/templateC/300/185', dataAiHint: 'stacked stones' },
];

export default function DesignTemplatesPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-heading text-3xl text-primary">Manage Gift Card Designs</CardTitle>
              <CardDescription>Upload, view, and manage design templates for customer gift cards.</CardDescription>
            </div>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <ImagePlus className="mr-2 h-5 w-5" />
              Upload New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <p className="text-muted-foreground">
              This section is a placeholder for the Design Template Management feature. 
              Administrators will be able to upload new gift card designs and manage existing ones. 
              Customers will then be able to select from these designs when personalizing their gift cards.
            </p>

            {mockTemplates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTemplates.map(template => (
                  <Card key={template.id} className="overflow-hidden group">
                    <div className="relative aspect-[1.618] bg-muted">
                       <Image 
                        src={template.imageUrl} 
                        alt={template.name} 
                        layout="fill" 
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={template.dataAiHint} 
                        />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-foreground">{template.name}</h3>
                      <div className="flex justify-end space-x-2 mt-3">
                        <Button variant="outline" size="sm" aria-label={`Edit ${template.name}`}>
                          <UploadCloud className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" aria-label={`Delete ${template.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg">
                <UploadCloud className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No templates uploaded yet.</p>
                <p className="text-sm text-muted-foreground">Click "Upload New Template" to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
