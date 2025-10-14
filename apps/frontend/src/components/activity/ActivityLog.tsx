"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
// import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { showErrorToast } from "@/components/providers/ToastProvider";
import {
  Activity,
  Calendar as CalendarIcon,
  Filter,
  Download,
  Loader2,
  User,
  FileText,
  BookOpen,
  Layers,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ActivityLogEntry {
  id: string;
  entity: string;
  entityId: string;
  action: string;
  details?: any;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  createdAt: string;
  user?: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  };
  workspace?: {
    id: string;
    name: string;
  };
}

interface ActivityLogProps {
  workspaceId?: string;
  entity?: string;
  entityId?: string;
  limit?: number;
}

const severityIcons = {
  INFO: Info,
  WARNING: AlertTriangle,
  ERROR: AlertCircle,
  CRITICAL: AlertCircle,
};

const severityColors = {
  INFO: 'bg-blue-100 text-blue-800',
  WARNING: 'bg-yellow-100 text-yellow-800',
  ERROR: 'bg-red-100 text-red-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

const entityIcons = {
  paper: FileText,
  collection: BookOpen,
  workspace: Layers,
  discussion: MessageSquare,
  user: User,
};

const actionLabels = {
  created: 'Created',
  updated: 'Updated',
  deleted: 'Deleted',
  shared: 'Shared',
  exported: 'Exported',
  message_added: 'Message Added',
  message_updated: 'Message Updated',
  message_deleted: 'Message Deleted',
};

export function ActivityLog({ workspaceId, entity, entityId, limit = 50 }: ActivityLogProps) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    entity: entity || '',
    action: '',
    severity: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (workspaceId) params.append('workspaceId', workspaceId);
      if (entity) params.append('entity', entity);
      if (entityId) params.append('entityId', entityId);
      if (filters.entity) params.append('entity', filters.entity);
      if (filters.action) params.append('action', filters.action);
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
      
      params.append('limit', limit.toString());

      const response = await fetch(`/api/activity-log?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch activity log');
      }

      const result = await response.json();
      setActivities(result.data.entries);
    } catch (error) {
      console.error('Activity log error:', error);
      showErrorToast('Failed to load activity log');
    } finally {
      setLoading(false);
    }
  }, [workspaceId, entity, entityId, filters, limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const getUserDisplayName = (user?: ActivityLogEntry['user']) => {
    if (!user) return 'System';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || 'Unknown User';
  };

  const getUserInitials = (user?: ActivityLogEntry['user']) => {
    if (!user) return 'S';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  const getEntityIcon = (entity: string) => {
    const Icon = entityIcons[entity as keyof typeof entityIcons] || Activity;
    return <Icon className="h-4 w-4" />;
  };

  const getSeverityIcon = (severity: string) => {
    const Icon = severityIcons[severity as keyof typeof severityIcons] || Info;
    return <Icon className="h-3 w-3" />;
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      
      if (workspaceId) params.append('workspaceId', workspaceId);
      if (entity) params.append('entity', entity);
      if (entityId) params.append('entityId', entityId);
      if (filters.entity) params.append('entity', filters.entity);
      if (filters.action) params.append('action', filters.action);
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
      
      params.append('format', 'csv');

      const response = await fetch(`/api/activity-log/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to export activity log');
      }

      const result = await response.json();
      
      // Download the file
      const blob = new Blob([result.data.content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      showErrorToast('Failed to export activity log');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Log
          </CardTitle>
          <Button onClick={handleExport} size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.entity}
            onValueChange={(value) => setFilters(prev => ({ ...prev, entity: value }))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Entities</SelectItem>
              <SelectItem value="paper">Papers</SelectItem>
              <SelectItem value="collection">Collections</SelectItem>
              <SelectItem value="workspace">Workspaces</SelectItem>
              <SelectItem value="discussion">Discussions</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.action}
            onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Actions</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
              <SelectItem value="exported">Exported</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.severity}
            onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Severities</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
              <SelectItem value="ERROR">Error</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(filters.startDate, "MMM dd") : "Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-4 text-center text-sm text-muted-foreground">
                Calendar component not available
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(filters.endDate, "MMM dd") : "End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-4 text-center text-sm text-muted-foreground">
                Calendar component not available
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activities found
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user?.image} />
                  <AvatarFallback className="text-xs">
                    {getUserInitials(activity.user)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {getUserDisplayName(activity.user)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {actionLabels[activity.action as keyof typeof actionLabels] || activity.action}
                    </span>
                    <div className="flex items-center gap-1">
                      {getEntityIcon(activity.entity)}
                      <span className="text-sm text-muted-foreground capitalize">
                        {activity.entity}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", severityColors[activity.severity])}
                    >
                      {getSeverityIcon(activity.severity)}
                      <span className="ml-1">{activity.severity}</span>
                    </Badge>
                  </div>
                  
                  {activity.details && (
                    <div className="text-sm text-muted-foreground">
                      {typeof activity.details === 'string' 
                        ? activity.details 
                        : JSON.stringify(activity.details)
                      }
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
