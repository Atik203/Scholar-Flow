"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getRoleDashboardBasePath } from "@/lib/auth/roles";
import { handleSignOutWithLoading } from "@/lib/auth/signout";
import { useAuth } from "@/redux/auth/useAuth";
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const { session } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!session?.user) {
    return null;
  }

  const { user } = session;
  const dashboardHref = getRoleDashboardBasePath(user.role);
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0]?.toUpperCase() || "U";

  const handleSignOut = () => {
    void handleSignOutWithLoading(setIsSigningOut);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`relative h-9 w-9 rounded-full hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 ${className}`}
        >
          <Avatar className="h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
            <AvatarImage
              src={user.image || ""}
              alt={user.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs dark:bg-primary/20">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 min-w-[18rem] mt-2 dark:bg-gray-800 dark:border-gray-700"
        align="end"
        forceMount
      >
        {/* User Info */}
        <div className="flex items-center justify-start gap-3 p-3 border-b dark:border-gray-700">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.image || ""}
              alt={user.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs dark:bg-primary/20">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none dark:text-white">
              {user.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground dark:text-gray-400">
              {user.email}
            </p>
            {user.role && (
              <p className="text-xs leading-none text-primary font-medium">
                {user.role}
              </p>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={dashboardHref} className="flex items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="dark:bg-gray-700" />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isSigningOut ? "Signing out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
