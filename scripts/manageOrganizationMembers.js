import { insertOrganizationMember, getOrganizationMembers, deleteOrganizationMember, resetMasterTable, createCopyMasterTable } from './masterTableUM.js'; // Import the functions from 'masterTableUM';

// Test Add Member
export const addMember = async ( memberName, storeNumber ) => {
    try {
        const { data, error } = await insertOrganizationMember({ memberName, storeNumber });
        if (error) {
            console.error('Error adding member:', error);
        } else {
            console.log('Member added successfully:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
};

// Example usage
const testData = {
    memberName: 'Dave Boku',
    storeNumber: 'SLJG'
};


addMember(testData.memberName, testData.storeNumber);