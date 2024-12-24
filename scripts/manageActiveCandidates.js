import { insertActiveCandidate, deleteActiveCandidate, deleteAllActiveCandidates } from "./table_functions/activeCandidatesFunctions";
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
        const { url: profile_pic, error: uploadError } = await uploadCandidateImage(imageFile);
        if (uploadError) {
            return { data: null, error: uploadError };
        }

        const memberId = await getMemberId(memberName);
        if (memberId === null) {
            // Clean up uploaded image if member doesn't exist
            await deleteCandidateImage(profile_pic);
            return { data: null, error: new Error('Member does not exist') };
        }
        
        const { data, error } = await insertActiveCandidate({memberId, profile_pic});
        if (error) {
            // Clean up uploaded image if insertion fails
            await deleteCandidateImage(profile_pic);
            throw error;
        }
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};


export const removeCandidate = async ({memberName}) => {
    try {
        if (!memberName) {
            return { data: null, error: new Error('Member name is required') };
        }    

        // Get candidate data first to get the image URL
        const memberId = await getMemberId(memberName);
        if (memberId === null) {
            return { data: null, error: new Error('Member does not exist') };
        }

        const { data: candidateData } = await getActiveCandidates();
        const candidate = candidateData?.find(c => c.member_id === memberId);
        
        if (candidate?.profile_pic) {
            // Delete image from storage
            await deleteCandidateImage(candidate.profile_pic);
        }
        
        const { data, error } = await deleteActiveCandidate({memberId});
        if (error) throw error;
        return { data, error: null };        
    } catch (error) {
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