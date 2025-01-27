import { supabase } from '@/services/supabaseClient';

export interface Member {
    member_id: string;
    member_name: string;
    store_number: string[];
    is_board_member: boolean;
}

export async function getOrganizationMembers(): Promise<Member[]> {
    const { data, error } = await supabase
        .from('organization_members')
        .select('*');

    if (error) {
        throw new Error(`Error fetching organization members: ${error.message}`);
    }

    return data || [];
}

export async function addOrganizationMember(memberName: string, storeNumber: string): Promise<Member> {
    // Check if member with this store number already exists
    const { data: existingMember, error: searchError } = await supabase
        .from('organization_members')
        .select()
        .contains('store_number', [storeNumber]);

    if (searchError) {
        throw new Error(`Error checking existing member: ${searchError.message}`);
    }

    if (existingMember && existingMember.length > 0) {
        throw new Error(`A member with store number ${storeNumber} already exists`);
    }

    // Check if member with same name exists to possibly append store number
    const { data: sameNameMember, error: nameSearchError } = await supabase
        .from('organization_members')
        .select()
        .eq('member_name', memberName)
        .single();

    if (nameSearchError && nameSearchError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw new Error(`Error checking member name: ${nameSearchError.message}`);
    }

    if (sameNameMember) {
        // Add store number to existing member
        const updatedStoreNumbers = [...sameNameMember.store_number, storeNumber];
        const { data: updateData, error: updateError } = await supabase
            .from('organization_members')
            .update({ store_number: updatedStoreNumbers })
            .eq('member_id', sameNameMember.member_id)
            .select()
            .single();

        if (updateError) {
            throw new Error(`Error updating member store numbers: ${updateError.message}`);
        }

        return updateData;
    } else {
        // Insert new member
        const { data: insertData, error: insertError } = await supabase
            .from('organization_members')
            .insert([{
                member_name: memberName,
                store_number: [storeNumber],
                is_board_member: false
            }])
            .select()
            .single();

        if (insertError) {
            throw new Error(`Error adding new member: ${insertError.message}`);
        }

        return insertData;
    }
}

export async function removeOrganizationMember(memberName: string, storeNumber: string): Promise<void> {
    // Find member with matching name and store number
    const { data: member, error: searchError } = await supabase
        .from('organization_members')
        .select()
        .eq('member_name', memberName)
        .contains('store_number', [storeNumber])
        .single();

    if (searchError) {
        throw new Error(`Member not found with name ${memberName} and store number ${storeNumber}`);
    }

    if (member.store_number.length === 1) {
        // If this is the only store number, delete the member
        const { error: deleteError } = await supabase
            .from('organization_members')
            .delete()
            .eq('member_id', member.member_id);

        if (deleteError) {
            throw new Error(`Error removing member: ${deleteError.message}`);
        }
    } else {
        // Remove the store number from the array
        const updatedStoreNumbers = member.store_number.filter((num: string) => num !== storeNumber);
        const { error: updateError } = await supabase
            .from('organization_members')
            .update({ store_number: updatedStoreNumbers })
            .eq('member_id', member.member_id);

        if (updateError) {
            throw new Error(`Error updating member store numbers: ${updateError.message}`);
        }
    }
}

export async function updateBoardMemberStatus(
    memberName: string, 
    storeNumber: string, 
    isBoardMember: boolean
): Promise<Member> {
    // First check if member exists
    const { data: member, error: searchError } = await supabase
        .from('organization_members')
        .select()
        .eq('member_name', memberName)
        .contains('store_number', [storeNumber])
        .single();

    if (searchError) {
        if (isBoardMember) {
            // If making them a board member and they don't exist, add them
            return addOrganizationMember(memberName, storeNumber).then(async (newMember) => {
                const { data, error: updateError } = await supabase
                    .from('organization_members')
                    .update({ is_board_member: true })
                    .eq('member_id', newMember.member_id)
                    .select()
                    .single();

                if (updateError) {
                    throw new Error(`Error setting board member status: ${updateError.message}`);
                }

                return data;
            });
        } else {
            throw new Error(`Member not found with name ${memberName} and store number ${storeNumber}`);
        }
    }

    // Update board member status
    const { data, error: updateError } = await supabase
        .from('organization_members')
        .update({ is_board_member: isBoardMember })
        .eq('member_id', member.member_id)
        .select()
        .single();

    if (updateError) {
        throw new Error(`Error updating board member status: ${updateError.message}`);
    }

    return data;
}
