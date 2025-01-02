import { supabase } from '../services/supabaseClient';

export interface OrgMember {
    member_id: string;
    created_at: string;
    updated_at: string;
}