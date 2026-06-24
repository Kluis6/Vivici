import { z } from "zod";

const baseServerSchema = z.object({
  DATABASE_URL: z.url(),
  DIRECT_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

const baseClientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

function formatErrors(error: z.ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
}

function resolveSupabasePublicKey(
  anonKey?: string,
  publishableKey?: string,
) {
  return anonKey ?? publishableKey;
}

export function getServerEnv() {
  const parsed = baseServerSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(`Invalid server environment: ${formatErrors(parsed.error)}`);
  }

  const supabasePublicKey = resolveSupabasePublicKey(
    parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    parsed.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (!supabasePublicKey) {
    throw new Error(
      "Invalid server environment: provide NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return {
    ...parsed.data,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabasePublicKey,
  };
}

export function getClientEnv() {
  const parsed = baseClientSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  if (!parsed.success) {
    throw new Error(`Invalid client environment: ${formatErrors(parsed.error)}`);
  }

  const supabasePublicKey = resolveSupabasePublicKey(
    parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    parsed.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (!supabasePublicKey) {
    throw new Error(
      "Invalid client environment: provide NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return {
    ...parsed.data,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabasePublicKey,
  };
}
