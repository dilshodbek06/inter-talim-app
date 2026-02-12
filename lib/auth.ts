// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { Role } from "@/src/generated/enums";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    // Session expires after 1 day, no sliding refresh.
    expiresIn: 60 * 60 * 24,
    disableSessionRefresh: true,
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: Role.USER,
        input: true,
      },
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://intertalim.uz",
    "https://www.intertalim.uz",
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
