"use client";

/**
 * ReportFormDialog — shared create/edit form for admin saved reports.
 * Create sends the full payload; edit omits `type` (immutable server-side).
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AdminReport,
  AdminReportFormat,
  AdminReportType,
} from "@/redux/api/adminReportsApi";
import { REPORT_TYPE_LABELS, REPORT_TYPE_OPTIONS } from "./constants";

export interface ReportFormValues {
  name: string;
  description?: string;
  type: AdminReportType;
  format: AdminReportFormat;
  schedule?: string;
  recipients: string[];
  enabled: boolean;
}

const SCHEDULE_PRESETS = [
  { value: "__none__", label: "No schedule (manual)" },
  { value: "0 9 * * *", label: "Daily at 09:00" },
  { value: "0 9 * * 1", label: "Weekly · Monday 09:00" },
  { value: "0 9 1 * *", label: "Monthly · 1st at 09:00" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ReportFormDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initial?: AdminReport | null;
  isLoading?: boolean;
  onSubmit: (values: ReportFormValues) => void;
}

export function ReportFormDialog({
  open,
  onClose,
  mode,
  initial,
  isLoading = false,
  onSubmit,
}: ReportFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<AdminReportType>("USAGE");
  const [format, setFormat] = useState<AdminReportFormat>("CSV");
  const [schedule, setSchedule] = useState("__none__");
  const [recipientsText, setRecipientsText] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [recipientsError, setRecipientsError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initial) {
      setName(initial.name);
      setDescription(initial.description ?? "");
      setType(initial.type);
      setFormat(initial.format);
      setSchedule(initial.schedule || "__none__");
      setRecipientsText((initial.recipients ?? []).join(", "));
      setEnabled(initial.enabled);
    } else {
      setName("");
      setDescription("");
      setType("USAGE");
      setFormat("CSV");
      setSchedule("__none__");
      setRecipientsText("");
      setEnabled(true);
    }
    setRecipientsError(null);
  }, [open, mode, initial]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    const recipients = recipientsText
      .split(/[,\n]/)
      .map((value) => value.trim())
      .filter(Boolean);
    const invalid = recipients.filter((email) => !EMAIL_RE.test(email));
    if (invalid.length > 0) {
      setRecipientsError(`Invalid email${invalid.length > 1 ? "s" : ""}: ${invalid.join(", ")}`);
      return;
    }
    setRecipientsError(null);

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      type,
      format,
      schedule: schedule === "__none__" ? undefined : schedule,
      recipients,
      enabled,
    });
  };

  const scheduleValue = SCHEDULE_PRESETS.some((p) => p.value === schedule)
    ? schedule
    : "__custom__";

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create report" : "Edit report"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Saved reports can be scheduled and downloaded as CSV or JSON."
              : "Update the report definition. The type is fixed once created."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-name">Name</Label>
            <Input
              id="report-name"
              value={name}
              maxLength={200}
              onChange={(e) => setName(e.target.value)}
              placeholder="Monthly User Activity"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-description">Description</Label>
            <Input
              id="report-description"
              value={description}
              maxLength={1000}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this report covers (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as AdminReportType)}
                disabled={mode === "edit"}
              >
                <SelectTrigger id="report-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {REPORT_TYPE_LABELS[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-format">Format</Label>
              <Select
                value={format}
                onValueChange={(value) => setFormat(value as AdminReportFormat)}
              >
                <SelectTrigger id="report-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="JSON">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-schedule">Schedule</Label>
            <Select value={scheduleValue} onValueChange={setSchedule}>
              <SelectTrigger id="report-schedule">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scheduleValue === "__custom__" && (
                  <SelectItem value="__custom__">
                    Custom ({schedule})
                  </SelectItem>
                )}
                {SCHEDULE_PRESETS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-recipients">
              Email recipients (comma separated)
            </Label>
            <Input
              id="report-recipients"
              value={recipientsText}
              onChange={(e) => setRecipientsText(e.target.value)}
              placeholder="team@example.com, lead@example.com"
            />
            {recipientsError && (
              <p className="text-xs text-destructive">{recipientsError}</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Checkbox
              id="report-enabled"
              checked={enabled}
              onCheckedChange={(checked) => setEnabled(checked === true)}
            />
            <Label htmlFor="report-enabled" className="font-normal">
              Enabled (schedule can run)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading
              ? "Saving..."
              : mode === "create"
                ? "Create report"
                : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
