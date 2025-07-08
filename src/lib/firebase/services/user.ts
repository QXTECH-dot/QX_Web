import { db } from '../config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  setDoc
} from 'firebase/firestore';

// Collection name
const USERS_COLLECTION = 'users';

export interface User {
  email: string;      // As primary key, unified with user_company table
  firstName: string;
  lastName: string;
  phoneNumber: string;
  position: string;
  company: string;
  avatar?: string;
  createdAt?: any;
  updatedAt?: any;
}

// Get next available user ID
export const getNextUserId = async (): Promise<string> => {
  try {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    let maxId = 0;
    
    snapshot.docs.forEach(doc => {
      const docId = doc.id;
      // Match user_00001 format document ID
      const match = docId.match(/^user_(\d+)$/);
      if (match) {
        const currentId = parseInt(match[1], 10);
        if (currentId > maxId) {
          maxId = currentId;
        }
      }
    });
    
    // Return next ID in format user_00001
    const nextId = maxId + 1;
    return `user_${nextId.toString().padStart(5, '0')}`;
  } catch (error: any) {
    console.error('[User] Error getting next user ID:', error);
    throw error;
  }
};

// Find user document ID by email
export const getUserDocIdByEmail = async (email: string): Promise<string | null> => {
  try {
    const q = query(collection(db, USERS_COLLECTION), where('email', '==', email));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
    return null;
  } catch (error: any) {
    console.error('[User] Error getting user doc ID by email:', error);
    throw error;
  }
};

// Create or update user information
export const createOrUpdateUser = async (userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<void> => {
  try {
    // First check if user already exists
    const existingDocId = await getUserDocIdByEmail(userData.email);
    
    const now = Timestamp.now();
    
    if (existingDocId) {
      // Update existing user
      const docRef = doc(db, USERS_COLLECTION, existingDocId);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: now
      });
      console.log(`[User] Updated existing user: ${existingDocId}`);
          } else {
        // Create new user with auto-incrementing ID
        const newDocId = await getNextUserId();
      const docRef = doc(db, USERS_COLLECTION, newDocId);
      await setDoc(docRef, {
        ...userData,
        createdAt: now,
        updatedAt: now
      });
      console.log(`[User] Created new user: ${newDocId}`);
    }
  } catch (error: any) {
    console.error('[User] Error creating/updating user:', error);
    throw error;
  }
};

// Get user information by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    // Query by email field
    const q = query(collection(db, USERS_COLLECTION), where('email', '==', email));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const userData = snapshot.docs[0].data() as User;
      return userData;
    }
    
    return null;
  } catch (error: any) {
    console.error('[User] Error getting user by email:', error);
    throw error;
  }
};

// Update user information
export const updateUser = async (email: string, updateData: Partial<Omit<User, 'email' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    console.log('[User] Updating user:', email, updateData);
    
    // Find document ID by email
    const docId = await getUserDocIdByEmail(email);
    if (!docId) {
      throw new Error(`User not found for email: ${email}`);
    }
    
    const docRef = doc(db, USERS_COLLECTION, docId);
    
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now()
    });
    
    console.log('[User] User updated successfully');
  } catch (error: any) {
    console.error('[User] Error updating user:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (email: string): Promise<void> => {
  try {
    // Find document ID by email
    const docId = await getUserDocIdByEmail(email);
    if (!docId) {
      throw new Error(`User not found for email: ${email}`);
    }
    
    const docRef = doc(db, USERS_COLLECTION, docId);
    await deleteDoc(docRef);
    console.log('[User] User deleted successfully');
  } catch (error: any) {
    console.error('[User] Error deleting user:', error);
    throw error;
  }
};

// Check if user exists
export const userExists = async (email: string): Promise<boolean> => {
  try {
    const user = await getUserByEmail(email);
    return user !== null;
  } catch (error: any) {
    console.error('[User] Error checking user existence:', error);
    return false;
  }
};

// Get all users (admin function)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users = snapshot.docs.map(doc => doc.data() as User);
    return users;
  } catch (error: any) {
    console.error('[User] Error getting all users:', error);
    throw error;
  }
}; 