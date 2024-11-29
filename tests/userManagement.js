import { supabase } from '../services/supabaseClient';

const getMemberByName = async (memberName) => {
  const { data, error } = await supabase
    .from('organization_members')
    .select('store_number')
    .eq('member_name', memberName)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is the "not found" error code
    throw error;
  }

  return data;
};

const createNewMember = async (memberName, storeNumber) => {
  const { data, error } = await supabase
    .from('organization_members')
    .insert([
      {
        member_name: memberName,
        store_number: [storeNumber]
      }
    ])
    .select();

  if (error) throw error;
  return data;
};

const updateMemberStoreNumbers = async (memberName, existingStoreNumbers, newStoreNumber) => {
  const { data, error } = await supabase
    .from('organization_members')
    .update({ 
      store_number: [...existingStoreNumbers, newStoreNumber] 
    })
    .eq('member_name', memberName)
    .select();

  if (error) throw error;
  return data;
};

export const insertOrganizationMember = async ({ memberName, storeNumber }) => {
  try {
    const existingMember = await getMemberByName(memberName);

    if (existingMember) {
      // Check for duplicate store number
      if (existingMember.store_number.includes(storeNumber)) {
        return { 
          data: null, 
          error: new Error('Store number already exists for this member') 
        };
      }

      // Update with new store number
      const data = await updateMemberStoreNumbers(memberName, existingMember.store_number, storeNumber);
      return { data, error: null };
    } else {
      // Create new member
      const data = await createNewMember(memberName, storeNumber);
      return { data, error: null };
    }
  } catch (error) {
    return { data: null, error };
  }
};

export const getOrganizationMembers = async () => {
  try {
    const { data, error } = await supabase
      .from('organization_members')
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const deleteOrganizationMember = async (memberName) => {
  try {
    const { data, error } = await supabase
      .from('organization_members')
      .delete()
      .eq('member_name', memberName);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};