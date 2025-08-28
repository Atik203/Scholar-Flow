import { cn } from "@/lib/utils";
import { Download, Filter, MoreHorizontal, Search } from "lucide-react";
import * as React from "react";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Input } from "../input";

export interface Column<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: number;
  render?: (value: any, row: T) => React.ReactNode;
  filterable?: boolean;
  hidden?: boolean;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  exportable?: boolean;
  className?: string;
  onRowSelect?: (selectedRows: T[]) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  onSearch?: (query: string) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
}

export function DataTable<T = any>({
  data,
  columns,
  searchable = true,
  sortable = true,
  selectable = true,
  exportable = true,
  className,
  onRowSelect,
  onSort,
  onSearch,
  loading = false,
  emptyState,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(
    new Set()
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(columns.map((col) => col.key))
  );

  const visibleColumnsList = columns.filter((col) =>
    visibleColumns.has(col.key)
  );

  const handleSort = (key: string) => {
    if (!sortable) return;

    const newDirection =
      sortConfig?.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key, direction: newDirection });
    onSort?.(key, newDirection);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleRowSelect = (rowIndex: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowIndex);
    } else {
      newSelected.delete(rowIndex);
    }
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected).map((i) => data[i]));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(data.map((_, i) => i)));
      onRowSelect?.(data);
    } else {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    }
  };

  const exportData = () => {
    const csvContent = [
      visibleColumnsList.map((col) => col.label).join(","),
      ...data.map((row) =>
        visibleColumnsList
          .map((col) => {
            const value = row[col.key as keyof T];
            return typeof value === "string" ? `"${value}"` : value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredData = React.useMemo(() => {
    let result = [...data];

    if (searchQuery) {
      result = result.filter((row) =>
        visibleColumnsList.some((col) => {
          const value = row[col.key as keyof T];
          return String(value)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        })
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof T];
        const bVal = b[sortConfig.key as keyof T];

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortConfig, visibleColumnsList]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        {emptyState || (
          <>
            <div className="text-muted-foreground">
              <p>No data available</p>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          )}

          {selectable && selectedRows.size > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedRows.size} row(s) selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                <DropdownMenuItem
                  key={column.key}
                  onSelect={(e) => e.preventDefault()}
                >
                  <Checkbox
                    checked={visibleColumns.has(column.key)}
                    onCheckedChange={(checked) => {
                      const newVisible = new Set(visibleColumns);
                      if (checked) {
                        newVisible.add(column.key);
                      } else {
                        newVisible.delete(column.key);
                      }
                      setVisibleColumns(newVisible);
                    }}
                    className="mr-2"
                  />
                  {column.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {exportable && (
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {selectable && (
                  <th className="p-3 text-left">
                    <Checkbox
                      checked={
                        selectedRows.size === data.length && data.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                )}
                {visibleColumnsList.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "p-3 text-left font-medium",
                      sortable &&
                        column.sortable &&
                        "cursor-pointer hover:bg-muted/70",
                      column.width && `w-[${column.width}px]`
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {sortable &&
                        column.sortable &&
                        sortConfig?.key === column.key && (
                          <span className="text-xs">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                    </div>
                  </th>
                ))}
                <th className="p-3 text-left w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-t hover:bg-muted/30 transition-colors"
                >
                  {selectable && (
                    <td className="p-3">
                      <Checkbox
                        checked={selectedRows.has(rowIndex)}
                        onCheckedChange={(checked) =>
                          handleRowSelect(rowIndex, !!checked)
                        }
                      />
                    </td>
                  )}
                  {visibleColumnsList.map((column) => (
                    <td key={column.key} className="p-3">
                      {column.render
                        ? column.render(row[column.key as keyof T], row)
                        : String(row[column.key as keyof T] ?? "")}
                    </td>
                  ))}
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
