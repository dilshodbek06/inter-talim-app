// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  sessionOptions: {
    // Revalidate session every 5 minutes to keep it fresh.
    refetchInterval: 300,
    refetchOnWindowFocus: false,
  },
});
