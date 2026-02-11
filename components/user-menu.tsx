"use client";

import { ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserMenuProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onNavigateResources: () => void;
  onSignOut: () => void;
};

type UserMenuSkeletonProps = {
  className?: string;
};

export const UserMenuSkeleton = ({ className }: UserMenuSkeletonProps) => {
  const baseClassName =
    "inline-flex h-10 items-center gap-2 rounded-md border border-gray-200/80 bg-background px-2.5";

  return (
    <div
      className={className ? `${baseClassName} ${className}` : baseClassName}
    >
      <div className="h-8 w-8 rounded-full bg-muted/70 animate-pulse" />
      <div className="h-3.5 w-3.5 rounded-full bg-muted/70 animate-pulse" />
    </div>
  );
};

const UserMenu = ({ user, onNavigateResources, onSignOut }: UserMenuProps) => {
  const displayName =
    user?.name || user?.email?.split("@")[0] || "Foydalanuvchi";
  const displayEmail = user?.email || "";
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="group inline-flex h-10 items-center gap-2 rounded-md border border-gray-200/80 bg-background px-2.5 text-left text-sm  transition hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Profil menyusi"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || ""} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {userInitials || "U"}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition group-hover:text-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-md border-border bg-background p-1 shadow-lg"
      >
        <DropdownMenuLabel className="rounded-md px-2 py-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.image || ""} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {userInitials || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {displayEmail}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          className="cursor-pointer rounded-md px-2 py-1.5 text-sm transition hover:bg-slate-100! hover:text-black! focus:bg-muted/70"
          onSelect={onNavigateResources}
        >
          Resurslarga o‘tish
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          className="cursor-pointer rounded-md px-2 py-1.5 text-sm text-destructive transition hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
          onSelect={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Chiqish
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
