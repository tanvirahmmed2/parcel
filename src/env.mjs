import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MONGODB_URI: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    BREVO_API_KEY: z.string().optional(), // Optional for dev environments simulating mail
  },
  client: {
    NEXT_PUBLIC_PUSHER_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_PUSHER_CLUSTER: z.string().min(1).optional(),
  },
  runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  },
});
