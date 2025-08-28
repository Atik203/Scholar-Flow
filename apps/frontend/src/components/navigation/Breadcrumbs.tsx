import { cn } from "@/lib/utils";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  showHome?: boolean;
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />,
  maxItems = 5,
  showHome = true,
  className,
  itemClassName,
  separatorClassName,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Add home item if enabled
  const allItems = React.useMemo(() => {
    const homeItem: BreadcrumbItem = {
      label: "Home",
      href: "/",
      icon: Home,
    };

    return showHome ? [homeItem, ...items] : items;
  }, [items, showHome]);

  // Handle responsive display
  const displayItems = React.useMemo(() => {
    if (allItems.length <= maxItems || isExpanded) {
      return allItems;
    }

    const visibleItems = allItems.slice(-maxItems + 1);
    const hiddenItems = allItems.slice(0, -maxItems + 1);

    return [
      ...hiddenItems.slice(0, 1),
      { label: "...", icon: MoreHorizontal },
      ...visibleItems,
    ];
  }, [allItems, maxItems, isExpanded]);

  // Handle item click
  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    if (item.onClick) {
      item.onClick();
    }

    // If it's the last item, don't do anything
    if (index === displayItems.length - 1) {
      return;
    }

    // If it has an href, let Next.js handle navigation
    if (item.href) {
      return;
    }
  };

  // Render breadcrumb item
  const renderItem = (item: BreadcrumbItem, index: number) => {
    const isLast = index === displayItems.length - 1;
    const isClickable = item.href || item.onClick;
    const isHidden = item.label === "..." && item.icon === MoreHorizontal;

    if (isHidden) {
      return (
        <DropdownMenu key={`hidden-${index}`}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 hover:bg-accent"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {allItems.slice(1, -maxItems + 1).map((hiddenItem, hiddenIndex) => (
              <DropdownMenuItem key={hiddenIndex} asChild>
                {hiddenItem.href ? (
                  <Link
                    href={hiddenItem.href}
                    className="flex items-center gap-2"
                  >
                    {hiddenItem.icon && <hiddenItem.icon className="h-3 w-3" />}
                    {hiddenItem.label}
                  </Link>
                ) : (
                  <button
                    onClick={hiddenItem.onClick}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    {hiddenItem.icon && <hiddenItem.icon className="h-3 w-3" />}
                    {hiddenItem.label}
                  </button>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    const itemContent = (
      <>
        {item.icon && <item.icon className="h-4 w-4" />}
        <span className="truncate">{item.label}</span>
      </>
    );

    if (isClickable && !isLast) {
      if (item.href) {
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
              itemClassName
            )}
          >
            {itemContent}
          </Link>
        );
      } else {
        return (
          <button
            key={item.label}
            onClick={() => handleItemClick(item, index)}
            className={cn(
              "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
              itemClassName
            )}
          >
            {itemContent}
          </button>
        );
      }
    }

    return (
      <span
        key={item.label}
        className={cn(
          "flex items-center gap-2 text-sm",
          isLast ? "text-foreground font-medium" : "text-muted-foreground",
          itemClassName
        )}
      >
        {itemContent}
      </span>
    );
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2", className)}
    >
      {displayItems.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {renderItem(item, index)}
          {index < displayItems.length - 1 && (
            <span className={cn("flex-shrink-0", separatorClassName)}>
              {separator}
            </span>
          )}
        </React.Fragment>
      ))}

      {allItems.length > maxItems && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-6 px-2 ml-2 text-xs"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
      )}
    </nav>
  );
};

// Compact breadcrumbs for mobile
export const CompactBreadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHome = true,
  className,
}) => {
  const allItems = React.useMemo(() => {
    const homeItem: BreadcrumbItem = {
      label: "Home",
      href: "/",
      icon: Home,
    };

    return showHome ? [homeItem, ...items] : items;
  }, [items, showHome]);

  // Show only first and last items for compact display
  const displayItems = React.useMemo(() => {
    if (allItems.length <= 2) {
      return allItems;
    }

    return [
      allItems[0],
      { label: "...", icon: MoreHorizontal },
      allItems[allItems.length - 1],
    ];
  }, [allItems]);

  return (
    <Breadcrumbs
      items={displayItems}
      maxItems={3}
      showHome={false}
      className={className}
    />
  );
};

// Breadcrumb with back button
export const BreadcrumbsWithBack: React.FC<
  BreadcrumbsProps & {
    onBack?: () => void;
    backLabel?: string;
  }
> = ({ items, onBack, backLabel = "Back", ...props }) => {
  return (
    <div className="flex items-center gap-4">
      {onBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          {backLabel}
        </Button>
      )}
      <Breadcrumbs items={items} {...props} />
    </div>
  );
};
