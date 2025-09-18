"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu, Moon, Settings, Sun, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AppSidebar } from "./AppSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [];

  // Generate breadcrumbs from path segments
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const href = "/" + segments.slice(0, i + 1).join("/");

    // Skip the first dashboard segment since we already added it
    if (segment === "dashboard") continue;

    // Format segment names
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({ label, href });
  }

  return breadcrumbs;
}

// Removed FloatingTrigger to avoid duplicate icons

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function UserMenu() {
  const { data: session } = useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback>
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Mobile Navigation Component
function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <AppSidebar />
      </SheetContent>
    </Sheet>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <div className="min-h-screen">
      {/* Mobile & Tablet Layout - Hidden sidebar, hamburger menu */}
      <div className="lg:hidden">
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex w-full items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <MobileNav />
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((breadcrumb, index) => (
                      <React.Fragment key={breadcrumb.href}>
                        <BreadcrumbItem>
                          {index === breadcrumbs.length - 1 ? (
                            <BreadcrumbPage className="font-medium">
                              {breadcrumb.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={breadcrumb.href}>
                              {breadcrumb.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="flex flex-col gap-6 p-4 md:p-6">{children}</div>
          </main>
        </div>
      </div>

      {/* Desktop Layout - Fixed Sidebar with Scrollable Content (Large screens only) */}
      <div className="hidden lg:flex min-h-screen">
        {/* Fixed Sidebar - Consistent width on large screens */}
        <aside className="fixed left-0 top-0 z-30 h-screen w-64 bg-sidebar border-r border-sidebar-border">
          <AppSidebar />
        </aside>

        {/* Main Content - Offset by sidebar width */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex w-full items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((breadcrumb, index) => (
                      <React.Fragment key={breadcrumb.href}>
                        <BreadcrumbItem>
                          {index === breadcrumbs.length - 1 ? (
                            <BreadcrumbPage className="font-medium">
                              {breadcrumb.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={breadcrumb.href}>
                              {breadcrumb.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="flex flex-col gap-6 p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
