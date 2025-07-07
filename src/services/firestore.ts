// src/services/firestore.ts
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc ,runTransaction } from 'firebase/firestore';

// Utility to remove undefined fields from an object
function removeUndefined(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
}

export const firestoreService = {
  /**
   * Add a college to user's wishlist
   */
  async addToWishlist(userId: string, college: any): Promise<void> {
    try {
      const userWishlistRef = doc(db, 'wishlists', userId);
      const docSnap = await getDoc(userWishlistRef);
      
      const cleanCollege = removeUndefined({
        ...college,
        id: college.id,
        cutoff_mark_2023: college.cutoff_mark_2023,
        cutoff_mark_2024: college.cutoff_mark_2024,
        notes: college.notes || ""
      });

      if (docSnap.exists()) {
        await setDoc(userWishlistRef, {
          colleges: {
            ...docSnap.data().colleges,
            [String(college.id)]: cleanCollege
          }
        }, { merge: true });
      } else {
        await setDoc(userWishlistRef, {
          colleges: {
            [String(college.id)]: cleanCollege
          }
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  /**
   * Get user's wishlist
   */
  async getWishlist(userId: string): Promise<any[]> {
    try {
      const userWishlistRef = doc(db, 'wishlists', userId);
      const docSnap = await getDoc(userWishlistRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.colleges) return [];
        
        return Object.values(data.colleges).map((college: any) => ({
          ...college,
          id: college.id,
          notes: college.notes || ""
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting wishlist:', error);
      return [];
    }
  },
  async saveNotes(userId: string, collegeId: string, notes: string): Promise<void> {
    try {
      const userWishlistRef = doc(db, 'wishlists', userId);
      
      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(userWishlistRef);
        if (!docSnap.exists()) throw new Error("Wishlist not found");
  
        const data = docSnap.data();
        if (!data.colleges?.[collegeId]) {
          throw new Error("College not found in wishlist");
        }
  
        transaction.update(userWishlistRef, {
          [`colleges.${collegeId}.notes`]: notes,
          [`colleges.${collegeId}.lastUpdated`]: new Date().toISOString()
        });
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      throw error;
    }
  },

  /**
   * Remove college from wishlist
   */
  async removeFromWishlist(userId: string, id: string): Promise<void> {
    try {
      const userWishlistRef = doc(db, 'wishlists', userId);
      
      // Use transaction to ensure atomic update
      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(userWishlistRef);
        if (!docSnap.exists()) {
          throw new Error("Wishlist document does not exist!");
        }
  
        const data = docSnap.data();
        const updatedColleges = { ...data.colleges };
        
        if (!updatedColleges[id]) {
          console.warn(`College ${id} not found in wishlist`);
          return;
        }
  
        delete updatedColleges[id];
        transaction.update(userWishlistRef, { colleges: updatedColleges });
      });
      
      console.log('Successfully removed college from wishlist in Firebase');
    } catch (error) {
      console.error('Error in removeFromWishlist:', error);
      throw error;
    }
  },
  /**
   * Save the custom wishlist order for a user
   */
  async setWishlistOrder(userId: string, order: string[]): Promise<void> {
    try {
      const userWishlistRef = doc(db, 'wishlists', userId);
      await setDoc(userWishlistRef, { order }, { merge: true });
    } catch (error) {
      console.error('Error saving wishlist order:', error);
      throw error;
    }
  },

  /**
   * Get the custom wishlist order for a user
   */
  async getWishlistOrder(userId: string): Promise<string[] | null> {
    try {
      const userWishlistRef = doc(db, 'wishlists', userId);
      const docSnap = await getDoc(userWishlistRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return Array.isArray(data.order) ? data.order : null;
      }
      return null;
    } catch (error) {
      console.error('Error getting wishlist order:', error);
      return null;
    }
  },
  
};