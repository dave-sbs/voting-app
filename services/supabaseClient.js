import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase credentials
const SUPABASE_URL = "https://veecqofclsibnudlhahx.supabase.co";


// export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE);