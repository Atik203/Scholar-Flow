"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActivityLog } from "@/components/activity/ActivityLog";
import { ArrowLeft, Activity, Filter, Download, Calendar, User, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function ResearchActivityLogPage() {
  const [filters, setFilters] = useState({
    search: "",
    severity: "",
    entityType: "",
    dateRange: "",
    userId: ""
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleExport = () => {
    console.log("Exporting activity log with filters:", filters);
  };

  const severityOptions = [
    { value: "", label: "All Severities" },
    { value: "INFO", label: "Info", icon: Info, color: "text-blue-600" },
    { value: "WARNING", label: "Warning", icon: AlertTriangle, color: "text-yellow-600" },
    { value: "ERROR", label: "Error", icon: XCircle, color: "text-red-600" },
    { value: "CRITICAL", label: "Critical", icon: AlertTriangle, color: "text-red-800" },
  ];

  const entityTypeOptions = [
    { value: "", label: "All Entities" },
    { value: "paper", label: "Papers" },
    { value: "collection", label: "Collections" },
    { value: "discussion", label: "Discussions" },
    { value: "annotation", label: "Annotations" },
    { value: "user", label: "Users" },
    { value: "workspace", label: "Workspaces" },
  ];

  const dateRangeOptions = [
    { value: "", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-background to-muted/30 p-6 rounded-lg border">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="hover:bg-white/80">
            <Link href="/research">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Research
            </Link>
          </Button>
          <div className="h-6 border-l border-border" />
          <div>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Research Activity Log
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor and track all research-related activities
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm text-muted-foreground">Total Activities</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">1,156</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">67</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Input
                placeholder="Search activities..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            
            <Select
              value={filters.severity}
              onValueChange={(value) => handleFilterChange("severity", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                {severityOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className={`h-4 w-4 ${option.color}`} />}
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select
              value={filters.entityType}
              onValueChange={(value) => handleFilterChange("entityType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                {entityTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.dateRange}
              onValueChange={(value) => handleFilterChange("dateRange", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setFilters({
                  search: "",
                  severity: "",
                  entityType: "",
                  dateRange: "",
                  userId: ""
                })}
                className="flex-1"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityLog 
            limit={100}
          />
        </CardContent>
      </Card>

      {/* Activity Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Dr. Sarah Johnson", count: 156, avatar: null },
                { name: "Dr. Michael Chen", count: 134, avatar: null },
                { name: "Dr. Emily Rodriguez", count: 98, avatar: null },
                { name: "Dr. David Kim", count: 87, avatar: null },
                { name: "Dr. Lisa Wang", count: 76, avatar: null },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <Badge variant="outline">{user.count} activities</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity by Entity Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: "Papers", count: 456, percentage: 36.6 },
                { type: "Discussions", count: 234, percentage: 18.8 },
                { type: "Annotations", count: 198, percentage: 15.9 },
                { type: "Collections", count: 156, percentage: 12.5 },
                { type: "Users", count: 123, percentage: 9.9 },
                { type: "Workspaces", count: 80, percentage: 6.4 },
              ].map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.type}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
