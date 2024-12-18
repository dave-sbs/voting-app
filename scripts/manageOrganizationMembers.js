import fs from 'fs';
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


// addMember(testData.memberName, testData.storeNumber);


export const loadVotersToTable = async () => {
    try {
            const filePath = '/Users/daveboku/Desktop/Coding/voting-project/scripts/voters.json';
            const fileContent = fs.readFileSync(filePath, 'utf-8'); // Synchronous read
            const voters = JSON.parse(fileContent);
        
            // Check if JSON is valid and iterable
            if (!Array.isArray(voters)) {
              throw new Error('Invalid JSON format. Expected an array.');
            }        
            for (const voter of voters) {
                const { id: storeNumber, name: memberName, hasVoted } = voter;
                const { data, error } = await insertOrganizationMember({ memberName, storeNumber });
                if (error) {
                    console.log("Member details:", { memberName, storeNumber });
                    console.error("Error adding member:", error);
                } else {
                    console.log("Member added successfully:", data);
                }
            }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
};



resetMasterTable();
loadVotersToTable();
