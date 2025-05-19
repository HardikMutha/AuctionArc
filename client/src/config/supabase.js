import { createClient } from "@supabase/supabase-js";

const Supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_URL
);

export default Supabase;
