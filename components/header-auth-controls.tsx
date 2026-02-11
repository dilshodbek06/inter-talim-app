"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import UserMenu, { UserMenuSkeleton } from "./user-menu";
import { Button } from "./ui/button";
import type { HeaderUser } from "./header-types";

type HeaderAuthControlsProps = {
  user: HeaderUser | null;
  isLoading?: boolean;
};

export default function HeaderAuthControls({
  user,
  isLoading = false,
}: HeaderAuthControlsProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/sign-in");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (isLoading) {
    return <UserMenuSkeleton />;
  }

  if (!user) {
    return (
      <Button variant="default" size="sm" asChild>
        <Link href="/sign-up">Bepul qo‘shilish</Link>
      </Button>
    );
  }

  return (
    <UserMenu
      user={user}
      onNavigateResources={() => router.push("/resources")}
      onSignOut={handleSignOut}
    />
  );
}
