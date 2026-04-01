import type { Category, DataService, Dupe, Product } from './api';

/**
 * Firebase API implementation stub.
 *
 * When the Firebase backend is ready, implement each method below
 * to call your Firestore/Cloud Functions endpoints. Then update
 * services/api.ts to export this instead of makeupApiService:
 *
 *   export { firebaseApiService as dataService } from './firebaseApi';
 */
export const firebaseApiService: DataService = {
  async searchProducts(_query: string): Promise<Product[]> {
    // TODO: Call Firebase Cloud Function or query Firestore
    // e.g. const snapshot = await firestore.collection('products').where(...).get();
    throw new Error('Firebase API not yet configured. Switch to makeupApi in services/api.ts');
  },

  async getProductsByCategory(_category: string): Promise<Product[]> {
    throw new Error('Firebase API not yet configured');
  },

  async getProductById(_id: string): Promise<Product | null> {
    throw new Error('Firebase API not yet configured');
  },

  async findDupes(_product: Product): Promise<Dupe[]> {
    // TODO: Call Siamese model endpoint for dupe matching
    throw new Error('Firebase API not yet configured');
  },

  async getCategories(): Promise<Category[]> {
    throw new Error('Firebase API not yet configured');
  },

  async getFeaturedDupes(): Promise<Dupe[]> {
    throw new Error('Firebase API not yet configured');
  },
};
