import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase credentials
const SUPABASE_URL = "https://veecqofclsibnudlhahx.supabase.co";
const SUPABASE_SERVICE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZWNxb2ZjbHNpYm51ZGxoYWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjczNTEyMCwiZXhwIjoyMDQ4MzExMTIwfQ.dWLb1HG1fyAckpMRRx43COF57EAb8Q5FjBcCeouQ-zc";


// export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE);