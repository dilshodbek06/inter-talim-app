import { auth } from "@/lib/auth"; // Asosiy auth konfiguratsiyasi
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function getUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireAuth(redirectUrl: string = "/sign-in") {
  const session = await getSession();

  if (!session) {
    redirect(redirectUrl);
  }

  return session;
}
