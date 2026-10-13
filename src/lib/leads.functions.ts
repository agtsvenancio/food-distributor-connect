import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { leadSchema } from "./lead-schema";
import type { Database } from "@/integrations/supabase/types";

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return { ok: false };
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      } },
    });
    const { website: _website, ...lead } = data;
    const { error } = await client.from("distributor_leads").insert(lead);
    return { ok: !error || error.code === "23505" };
  });