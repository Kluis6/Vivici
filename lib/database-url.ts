export function getPgSslConfig(databaseUrl: string) {
  const isSupabaseHost = databaseUrl.includes(".supabase.co");
  const isLocalRuntime = process.env.VERCEL !== "1" && process.env.VERCEL !== "true";

  if (isSupabaseHost && isLocalRuntime) {
    return {
      rejectUnauthorized: false,
    };
  }

  return undefined;
}

export function getPgConnectionString(databaseUrl: string) {
  const isSupabaseHost = databaseUrl.includes(".supabase.co");
  const isLocalRuntime = process.env.VERCEL !== "1" && process.env.VERCEL !== "true";

  if (!isSupabaseHost || !isLocalRuntime) {
    return databaseUrl;
  }

  const normalizedUrl = new URL(databaseUrl);
  normalizedUrl.searchParams.delete("sslmode");

  return normalizedUrl.toString();
}
