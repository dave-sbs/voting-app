import { supabase } from '../services/supabaseClient';


export async function getVoteChoices() {
    const { data, error } = await supabase
      .from('voting_settings')
      // specify columns to be safe
      .select('min_choice, max_choice')
      .single();
  
    if (error) throw error;
    return data; // { min_votes: number, max_votes: number }
  }
  
  // Update the single row
  export async function setMaxChoice(maxChoice: number) {
    const { data, error } = await supabase
      .from('voting_settings')
      .update({ max_choice: maxChoice })
      .eq('id', 1);
  
    if (error) throw error;
    return data;
  }
  
  export async function setMinChoice(minChoice: number) {
    const { data, error } = await supabase
      .from('voting_settings')
      .update({ min_choice: minChoice })
      .eq('id', 1);
  
    if (error) throw error;
    return data;
  }
  