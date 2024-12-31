import { supabase } from '../../services/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const uploadCandidateImage = async (imageFile) => {
    try {
        // Generate a unique filename
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `candidate-photos/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('candidate-images')
            .upload(filePath, imageFile, {
                cacheControl: '3600',
                upsert: false,
                contentType: imageFile.type
            });

        if (error) throw error;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from('candidate-images')
            .getPublicUrl(filePath);

        return { url: publicUrl, error: null };
    } catch (error) {
        return { url: null, error };
    }
};

export const deleteCandidateImage = async (imageUrl) => {
    try {
        // Extract file path from URL
        const filePath = imageUrl.split('/').pop();
        
        const { error } = await supabase.storage
            .from('candidate-images')
            .remove([`candidate-photos/${filePath}`]);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        return { error };
    }
};