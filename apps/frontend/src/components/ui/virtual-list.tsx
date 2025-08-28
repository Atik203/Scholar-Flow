import { cn } from "@/lib/utils";
import * as React from "react";
import { FixedSizeList, FixedSizeListProps } from "react-window";

export interface VirtualListProps<T = any>
  extends Omit<FixedSizeListProps, "children" | "itemCount" | "itemSize"> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  className?: string;
  containerClassName?: string;
  emptyState?: React.ReactNode;
  loading?: boolean;
  loadingState?: React.ReactNode;
}

export const VirtualList = React.forwardRef<FixedSizeList, VirtualListProps>(
  (
    {
      items,
      renderItem,
      itemHeight,
      className,
      containerClassName,
      emptyState,
      loading = false,
      loadingState,
      height = 400,
      width = "100%",
      ...props
    },
    ref
  ) => {
    if (loading) {
      return (
        <div
          className={cn(
            "flex items-center justify-center p-8",
            containerClassName
          )}
        >
          {loadingState || (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          )}
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div
          className={cn(
            "flex items-center justify-center p-8",
            containerClassName
          )}
        >
          {emptyState || (
            <div className="text-center text-muted-foreground">
              <p>No items to display</p>
            </div>
          )}
        </div>
      );
    }

    const Row = ({
      index,
      style,
    }: {
      index: number;
      style: React.CSSProperties;
    }) => (
      <div style={style} className={cn("px-4", className)}>
        {renderItem(items[index], index)}
      </div>
    );

    return (
      <div className={containerClassName}>
        <FixedSizeList
          ref={ref}
          height={height}
          itemCount={items.length}
          itemSize={itemHeight}
          width={width}
          className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          {...props}
        >
          {Row}
        </FixedSizeList>
      </div>
    );
  }
);

VirtualList.displayName = "VirtualList";

// Specialized virtual list components
export const VirtualTable = React.forwardRef<
  FixedSizeList,
  VirtualListProps & {
    columns: {
      key: string;
      label: string;
      width: number;
      render?: (value: any, item: any) => React.ReactNode;
    }[];
  }
>(({ items, columns, itemHeight = 48, className, height = 400, width, ...props }, ref) => {
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => (
    <div style={style} className={cn("flex border-b border-border", className)}>
      {columns.map((column) => (
        <div
          key={column.key}
          style={{ width: column.width }}
          className="px-4 py-3 flex items-center"
        >
          {column.render
            ? column.render(items[index][column.key], items[index])
            : items[index][column.key]}
        </div>
      ))}
    </div>
  );

  const Header = () => (
    <div className="flex border-b-2 border-border font-semibold bg-muted/50">
      {columns.map((column) => (
        <div
          key={column.key}
          style={{ width: column.width }}
          className="px-4 py-3"
        >
          {column.label}
        </div>
      ))}
    </div>
  );

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Header />
      <FixedSizeList
        ref={ref}
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        width={width || totalWidth}
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        {...props}
      >
        {Row}
      </FixedSizeList>
    </div>
  );
});

VirtualTable.displayName = "VirtualTable";
