"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import UserMenu from "./user-menu";
import { Button } from "./ui/button";
import type { HeaderUser } from "./header-types";

type HeaderAuthControlsProps = {
  user: HeaderUser | null;
};

export default function HeaderAuthControls({ user }: HeaderAuthControlsProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/sign-in");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

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
