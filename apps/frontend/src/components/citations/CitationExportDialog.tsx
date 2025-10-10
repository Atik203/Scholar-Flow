"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { Download, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const citationFormSchema = z.object({
  format: z.enum(['BIBTEX', 'ENDNOTE', 'APA', 'MLA', 'IEEE', 'CHICAGO', 'HARVARD']),
  includeAbstract: z.boolean(),
  includeKeywords: z.boolean(),
});

type CitationFormData = z.infer<typeof citationFormSchema>;

interface CitationExportDialogProps {
  paperIds?: string[];
  collectionId?: string;
  collectionName?: string;
  paperTitles?: string[];
  trigger?: React.ReactNode;
}

const citationFormats = [
  { value: 'BIBTEX', label: 'BibTeX', description: 'Standard bibliography format for LaTeX' },
  { value: 'ENDNOTE', label: 'EndNote', description: 'EndNote reference manager format' },
  { value: 'APA', label: 'APA', description: 'American Psychological Association style' },
  { value: 'MLA', label: 'MLA', description: 'Modern Language Association style' },
  { value: 'IEEE', label: 'IEEE', description: 'Institute of Electrical and Electronics Engineers style' },
  { value: 'CHICAGO', label: 'Chicago', description: 'Chicago Manual of Style' },
  { value: 'HARVARD', label: 'Harvard', description: 'Harvard referencing style' },
];

export function CitationExportDialog({
  paperIds = [],
  collectionId,
  collectionName,
  paperTitles = [],
  trigger
}: CitationExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedContent, setExportedContent] = useState<string>("");
  const [exportFormat, setExportFormat] = useState<string>("");

  const form = useForm<CitationFormData>({
    resolver: zodResolver(citationFormSchema),
    defaultValues: {
      format: 'APA',
      includeAbstract: false,
      includeKeywords: false,
    },
  });

  const handleExport = async (data: CitationFormData) => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/citations/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          ...(paperIds.length > 0 && { paperIds }),
          ...(collectionId && { collectionId }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export citations');
      }

      const result = await response.json();
      setExportedContent(result.data.content);
      setExportFormat(result.data.format);
      showSuccessToast(`Successfully exported ${result.data.count} citations in ${result.data.format} format`);
    } catch (error) {
      console.error('Citation export error:', error);
      showErrorToast('Failed to export citations. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!exportedContent) return;

    const extension = exportFormat.toLowerCase() === 'bibtex' ? 'bib' : 'txt';
    const filename = collectionId 
      ? `${collectionName || 'collection'}-citations.${extension}`
      : `citations.${extension}`;

    const blob = new Blob([exportedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getItemCount = () => {
    if (collectionId) return `${collectionName || 'Collection'}`;
    if (paperIds.length > 0) return `${paperIds.length} paper${paperIds.length > 1 ? 's' : ''}`;
    return '0 papers';
  };

  const getItemList = () => {
    if (paperTitles.length > 0) {
      return paperTitles.slice(0, 3).map((title, index) => (
        <div key={index} className="text-sm text-muted-foreground truncate">
          {title}
        </div>
      ));
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Citations
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Citations
          </DialogTitle>
          <DialogDescription>
            Export citations for {getItemCount()} in your preferred format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Preview */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-2">Items to export:</div>
            {getItemList()}
            {paperTitles.length > 3 && (
              <div className="text-sm text-muted-foreground">
                ... and {paperTitles.length - 3} more
              </div>
            )}
          </div>

          {/* Export Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleExport)} className="space-y-4">
              <FormField
                control={form.control}
                name="format"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Citation Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select citation format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {citationFormats.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{format.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {format.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="includeAbstract"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include Abstract</FormLabel>
                        <FormDescription>
                          Include paper abstracts in the citation export
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeKeywords"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include Keywords</FormLabel>
                        <FormDescription>
                          Include paper keywords in the citation export
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isExporting}>
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Citations
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Export Result */}
          {exportedContent && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{exportFormat}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Export completed successfully
                  </span>
                </div>
                <Button onClick={handleDownload} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Preview:</div>
                <Textarea
                  value={exportedContent}
                  readOnly
                  className="min-h-[200px] font-mono text-xs"
                  placeholder="Exported citations will appear here..."
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
