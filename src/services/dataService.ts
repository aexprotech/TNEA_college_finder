// Updated service using IndexedDB for large datasets
import { indexedDBService, CollegeRecord, SearchFilters, SearchResult } from './indexedDBService';

class DataService {
  // Load data from IndexedDB
  async loadData(): Promise<CollegeRecord[]> {
    try {
      return await indexedDBService.getAllRecords();
    } catch (error) {
      console.error('Error loading data from IndexedDB:', error);
      return [];
    }
  }

  // Get all data
  async getAllData(): Promise<CollegeRecord[]> {
    return await this.loadData();
  }

  // Check if data exists
  async hasData(): Promise<boolean> {
    return await indexedDBService.hasData();
  }

  // Store data (replaces existing data)
  async storeData(data: CollegeRecord[]): Promise<void> {
    await indexedDBService.clearData();
    await indexedDBService.bulkInsert(data);
  }

  // Get unique categories
  async getUniqueCategories(): Promise<string[]> {
    return await indexedDBService.getUniqueValues('category');
  }

  // Get unique branch names
  async getUniqueBranches(): Promise<string[]> {
    return await indexedDBService.getUniqueValues('branch_name');
  }

  // Get unique districts
  async getUniqueDistricts(): Promise<string[]> {
    return await indexedDBService.getUniqueValues('district');
  }

  // Search colleges based on filters
  async searchColleges(filters: SearchFilters): Promise<SearchResult[]> {
    return await indexedDBService.searchColleges(filters);
  }

  // Get statistics
  async getStatistics() {
    return await indexedDBService.getStatistics();
  }
}

export const dataService = new DataService();
export type { CollegeRecord, SearchFilters, SearchResult };