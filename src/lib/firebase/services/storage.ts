import { storage } from '../config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Upload user avatar to Firebase Storage
export const uploadUserAvatar = async (file: Blob, userId: string): Promise<string> => {
  try {
    console.log('[Storage] Uploading avatar for user:', userId);
    
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `avatars/${userId}/avatar_${timestamp}.png`;
    
    // Create storage reference
    const storageRef = ref(storage, filename);
    
    // Upload the file
    const uploadResult = await uploadBytes(storageRef, file);
    console.log('[Storage] Upload successful:', uploadResult.metadata.fullPath);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log('[Storage] Download URL generated:', downloadURL);
    
    return downloadURL;
  } catch (error: any) {
    console.error('[Storage] Error uploading avatar:', error);
    throw new Error(`Failed to upload avatar: ${error.message}`);
  }
};

// Upload company logo to Firebase Storage
export const uploadCompanyLogo = async (file: Blob, companyId: string): Promise<string> => {
  try {
    console.log('[Storage] Uploading logo for company:', companyId);
    
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `logos/${companyId}/logo_${timestamp}.png`;
    
    // Create storage reference
    const storageRef = ref(storage, filename);
    
    // Upload the file
    const uploadResult = await uploadBytes(storageRef, file);
    console.log('[Storage] Upload successful:', uploadResult.metadata.fullPath);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log('[Storage] Download URL generated:', downloadURL);
    
    return downloadURL;
  } catch (error: any) {
    console.error('[Storage] Error uploading logo:', error);
    throw new Error(`Failed to upload logo: ${error.message}`);
  }
};

// Delete file from Firebase Storage
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    console.log('[Storage] Deleting file:', fileUrl);
    
    // Create reference from URL
    const fileRef = ref(storage, fileUrl);
    
    // Delete the file
    await deleteObject(fileRef);
    console.log('[Storage] File deleted successfully');
  } catch (error: any) {
    console.error('[Storage] Error deleting file:', error);
    // Don't throw error for deletion failures as they are not critical
  }
};

// Generate a unique user ID for storage
export const generateUserId = (email: string): string => {
  // Create a consistent user ID from email for storage purposes
  return email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}; 