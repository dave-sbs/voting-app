import { supabase } from '../services/supabaseClient';

const getMemberStoreNumber = async (memberName) => {
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


const getMemberId = async (memberName) => {
  const { data, error } = await supabase
    .from('organization_members')
    .select('member_id')
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
    // Check for empty parameters
    if (!memberName || !storeNumber) {
      return { data: null, error: new Error('Member name and store number are required') };
    }

    // Check for wrong data entry
    else if (typeof memberName !== 'string' || typeof storeNumber !== 'string') {
      return { data: null, error: new Error('Member name and store number must be strings') };
    }

    const existingMemberId = await getMemberId(memberName);
    const existingMemberStores = await getMemberStoreNumber(memberName);

    if (existingMemberId !== null) {
      // Check for duplicate store number
      if (existingMemberStores.store_number.includes(storeNumber)) {
        return { 
          data: null, 
          error: new Error('Store number already exists for this member') 
        };
      }

      // Update with new store number
      const data = await updateMemberStoreNumbers(memberName, existingMemberStores.store_number, storeNumber);
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

// Eventually change to Member ID
export const deleteOrganizationMember = async (memberName) => {
  try {
    const memberId = await getMemberId(memberName);

    if (memberId === null) {
      return { data: null, error: new Error('Member does not exist') };
    }

    const { data, error } = await supabase
      .from('organization_members')
      .delete()
      .eq('member_id', memberId.member_id);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};