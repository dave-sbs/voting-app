import { insertActiveCandidate, deleteActiveCandidate, deleteAllActiveCandidates, getActiveCandidates } from "./table_functions/activeCandidatesFunctions";
import { getMemberId } from "./table_functions/masterTableFunctions";
import { uploadCandidateImage, deleteCandidateImage } from './storage_functions/imageStorage';

export const addNewCandidates = async ({memberName, imageFile}) => {
    try {
        if (!memberName || !imageFile) {
            return { data: null, error: new Error('Member name and image file are required') };
        }

        // Validate image file
        if (!imageFile.type.startsWith('image/')) {
            return { data: null, error: new Error('File must be an image') };
        }

        // Upload image first
        const { url: profile_picture, error: uploadError } = await uploadCandidateImage(imageFile);
        if (uploadError) {
            return { data: null, error: uploadError };
        }

        const memberId = await getMemberId(memberName);
        console.log(memberId);
        if (memberId === null) {
            // Clean up uploaded image if member doesn't exist
            await deleteCandidateImage(profile_picture);
            return { data: null, error: new Error('Member does not exist') };
        }
        
        const { data, error } = await insertActiveCandidate({memberId, profile_picture});
        if (error) {
            // Clean up uploaded image if insertion fails
            await deleteCandidateImage(profile_picture);
            throw error;
        }
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};


export const removeCandidate = async ({memberId}) => {
    console.log('Starting removeCandidate function');
    try {
        if (!memberId) {
            console.log('Error: Member Id is required');
            return { data: null, error: new Error('Member Id is required') };
        }    

        if (memberId === null) {
            console.log('Error: Member does not exist');
            return { data: null, error: new Error('Member does not exist') };
        }

        console.log('Fetching active candidates');
        const { data: candidateData, error: fetchError } = await getActiveCandidates();
        if (fetchError) {
            console.log('Error fetching candidates:', fetchError);
            throw fetchError;
        }

        const candidate = candidateData?.find(c => c.member_id === memberId);
        console.log('Candidate found:', candidate ? 'Yes' : 'No');
        
        console.log('Deleting active candidate');
        const { data, error } = await deleteActiveCandidate({memberId});
        if (error) {
            console.log('Error deleting candidate:', error);
            throw error;
        }
        
        if (candidate?.profile_picture) {
            console.log('Deleting candidate image');
            await deleteCandidateImage(candidate.profile_picture);
        }
        
        console.log('Candidate removed successfully');
        return { data, error: null };        
    } catch (error) {
        console.log('Error in removeCandidate:', error);
        return { data: null, error };
    }
};


export const voteForCandidate = async ({memberName}) => {
    try {
        if (!memberName) {
            return { data: null, error: new Error('Member name is required') };
        }

        // Check for wrong data entry        
        else if (typeof memberName !== 'string') {
            return { data: null, error: new Error('Member name must be a string') };
        }       
        
        const memberId = await getMemberId(memberName);
        if (memberId === null) {
            return { data: null, error: new Error('Member does not exist') };
        }
        
        const { data, error } = await deleteAllActiveCandidates();
        if (error) throw error;
        return { data, error: null };        
    } catch (error) {
        return { data: null, error };
    }
}