'use client';

import React, { useState } from 'react';
import type { DesignTemplate } from '@/lib/types';
import { initialDesignTemplates } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { UploadCloud, ImagePlus, Trash2, Edit3, Eye } from "lucide-react";
import Image from "next/image";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const templateFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters."),
  imageUrl: z.string().url("Must be a valid URL for the image."),
  dataAiHint: z.string().max(50, "AI hint too long (max 2 words recommended).").optional(),
  featuredOccasion: z.string().optional(),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

const occasionsForFeatured = ["Birthday", "Anniversary", "Thank You", "Congratulations", "Holiday", "Just Because", "Unbirthday", "Other"];
const NONE_VALUE = "__NONE__"; // Placeholder value for the "None" option in Select

export default function DesignTemplatesPage() {
  const [templates, setTemplates] = useState<DesignTemplate[]>(initialDesignTemplates);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DesignTemplate | null>(null);
  const { toast } = useToast();

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
      dataAiHint: '',
      featuredOccasion: NONE_VALUE, // Use placeholder value for default representing "None"
    }
  });

  const handleOpenForm = (template?: DesignTemplate) => {
    if (template) {
      setEditingTemplate(template);
      form.reset({
        id: template.id,
        name: template.name,
        imageUrl: template.imageUrl,
        dataAiHint: template.dataAiHint || '',
        featuredOccasion: template.featuredOccasion || NONE_VALUE, // Use placeholder if undefined/null
      });
    } else {
      setEditingTemplate(null);
      // Reset with placeholder for featuredOccasion
      form.reset({ name: '', imageUrl: 'https://picsum.photos/seed/newTemplate/600/370', dataAiHint: '', featuredOccasion: NONE_VALUE });
    }
    setIsFormOpen(true);
  };

  const onSubmit = (values: TemplateFormValues) => {
     // Ensure empty string is saved if "None" was selected, not the placeholder
    const saveData = {
      ...values,
      featuredOccasion: values.featuredOccasion === NONE_VALUE ? '' : values.featuredOccasion,
    };

    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...t, ...saveData, id: t.id } : t));
      toast({ title: "Template Updated", description: `"${saveData.name}" has been updated.` });
    } else {
      const newId = `template_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      setTemplates([...templates, { ...saveData, id: newId }]);
      toast({ title: "Template Added", description: `"${saveData.name}" has been added.` });
    }
    setIsFormOpen(false);
    setEditingTemplate(null);
    form.reset({ name: '', imageUrl: '', dataAiHint: '', featuredOccasion: NONE_VALUE }); // Reset form after submit
  };

  const handleDelete = (templateId: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter(t => t.id !== templateId));
      toast({ title: "Template Deleted", description: "The design template has been removed.", variant: "destructive" });
    }
  };

  const justBecauseTemplates = templates.filter(
    t => t.featuredOccasion === 'Just Because' || !t.featuredOccasion || t.featuredOccasion === 'Other'
  );


  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-heading font-bold text-3xl text-primary">Manage Gift Card Designs</CardTitle>
              <CardDescription>Upload, view, and manage design templates for customer gift cards.</CardDescription>
            </div>
            <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
              setIsFormOpen(isOpen);
              if (!isOpen) {
                form.reset({ name: '', imageUrl: '', dataAiHint: '', featuredOccasion: NONE_VALUE }); // Ensure reset on close
                setEditingTemplate(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleOpenForm()}>
                  <ImagePlus className="mr-2 h-5 w-5" />
                  Add New Template
                </Button>
              </DialogTrigger>
              {/* Increase max-width here */}
              <DialogContent className="sm:max-w-2xl">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                      <DialogTitle className="font-heading font-bold text-2xl">{editingTemplate ? 'Edit' : 'Add New'} Design Template</DialogTitle>
                      <DialogDescription>
                        {editingTemplate ? 'Modify the details of this template.' : 'Fill in the details for the new gift card design template.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Template Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Spring Blossoms" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl><Input placeholder="https://picsum.photos/seed/example/600/370" {...field} /></FormControl>
                            <FormMessage />
                            {field.value && form.formState.errors.imageUrl?.type !== 'url' && (
                              <div className="mt-2 relative aspect-[1.618] w-full max-w-xs mx-auto rounded border overflow-hidden bg-muted">
                                <Image src={field.value} alt="Preview" layout="fill" objectFit="cover" data-ai-hint="template preview" onError={(e) => e.currentTarget.style.display = 'none'}/>
                              </div>
                            )}
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dataAiHint"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>AI Hint (Optional)</FormLabel>
                            <FormControl><Input placeholder="e.g., floral pattern" {...field} /></FormControl>
                            <FormDescription>Keywords for image search (max 2 words).</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="featuredOccasion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Featured Occasion (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || NONE_VALUE}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a featured occasion (or None)" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {/* Use a non-empty placeholder value */}
                                <SelectItem value={NONE_VALUE}>None</SelectItem>
                                {occasionsForFeatured.map(occ => (
                                  <SelectItem key={occ} value={occ}>{occ}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>Help categorize this template, e.g., for "Just Because".</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter className="pt-4">
                       <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">Save Template</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {templates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <Card key={template.id} className="overflow-hidden group relative flex flex-col">
                  <div className="relative aspect-[1.618] bg-muted">
                     <Image
                      src={template.imageUrl}
                      alt={template.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={template.dataAiHint || "card design"}
                      />
                  </div>
                  <CardContent className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{template.name}</h3>
                      {/* Display "None" or the occasion */}
                      <p className="text-xs text-muted-foreground mb-2">Featured: {template.featuredOccasion || 'None'}</p>
                    </div>
                    <div className="flex justify-end space-x-2 mt-auto">
                      <Button variant="outline" size="sm" aria-label={`Edit ${template.name}`} onClick={() => handleOpenForm(template)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" aria-label={`Delete ${template.name}`} onClick={() => handleDelete(template.id)}>
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
              <p className="text-sm text-muted-foreground">Click "Add New Template" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
            <CardTitle className="font-heading font-bold text-2xl text-primary">Special: "Just Because" Designs</CardTitle>
            <CardDescription>Quickly find designs perfect for a spontaneous gift.</CardDescription>
        </CardHeader>
        <CardContent>
            {justBecauseTemplates.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {justBecauseTemplates.slice(0,3).map(template => (
                        <Card key={`jb-${template.id}`} className="overflow-hidden group">
                             <div className="relative aspect-[1.618] bg-muted">
                                <Image src={template.imageUrl} alt={template.name} layout="fill" objectFit="cover" data-ai-hint={template.dataAiHint || "card design"}/>
                             </div>
                             <CardFooter className="p-3 flex justify-between items-center">
                                <p className="font-medium text-sm truncate flex-1">{template.name}</p>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                                  toast({title: "Previewing 'Just Because' Design", description: `"${template.name}" would be a great choice!`});
                                }}>
                                    <Eye className="h-4 w-4"/>
                                </Button>
                             </CardFooter>
                        </Card>
                    ))}
                 </div>
            ): (
                <p className="text-muted-foreground">No specific "Just Because" templates found. Add some or mark existing ones!</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
