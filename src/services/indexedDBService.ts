// IndexedDB service for handling large datasets
export interface CollegeRecord {
  id?: number;
  year: number;
  college_code: number;
  college_name: string;
  branch_code: string;
  branch_name: string;
  category: string;
  cutoff_mark: number;
  district: string;
  location?: string;
  institute_type?: string;
  quota?: string;
  gender?: string;
  opening_rank?: number;
  closing_rank?: number;
  ranking?: string;
}

export interface SearchFilters {
  cutoff: number;
  category: string;
  district?: string;
  course?: string;
}

export interface SearchResult extends CollegeRecord {
  matchType: 'Closest Match' | 'Good Fit' | 'Consider This';
  cutoffDifference: number;
}

class IndexedDBService {
  private dbName = 'CollegeFinderDB';
  private version = 1;
  private storeName = 'colleges';
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          // Create indexes for faster searching
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('district', 'district', { unique: false });
          store.createIndex('branch_name', 'branch_name', { unique: false });
          store.createIndex('cutoff_mark', 'cutoff_mark', { unique: false });
          store.createIndex('college_name', 'college_name', { unique: false });
        }
      };
    });
  }

  async clearData(): Promise<void> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async bulkInsert(records: CollegeRecord[]): Promise<void> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      let completed = 0;
      const total = records.length;

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);

      // Insert all records synchronously to keep transaction active
      for (let i = 0; i < total; i++) {
        const request = store.add(records[i]);
        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve();
          }
        };
        request.onerror = () => reject(request.error);
      }
    });
  }

  async getAllRecords(): Promise<CollegeRecord[]> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getUniqueValues(field: keyof CollegeRecord): Promise<string[]> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const records = request.result;
        const uniqueValues = [...new Set(records.map(record => String(record[field])))];
        resolve(uniqueValues.sort());
      };
    });
  }

  async searchColleges(filters: SearchFilters): Promise<SearchResult[]> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('category');
      const request = index.getAll(filters.category);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        let results = request.result;

        // Apply additional filters
        if (filters.district) {
          results = results.filter(record =>
            record.district.toLowerCase().includes(filters.district!.toLowerCase())
          );
        }

        if (filters.course) {
          results = results.filter(record =>
            record.branch_name.toLowerCase().includes(filters.course!.toLowerCase())
          );
        }

        // Apply cutoff matching algorithm
        const searchResults: SearchResult[] = results.map(record => {
          const cutoffDiff = Math.abs(record.cutoff_mark - filters.cutoff);
          let matchType: 'Closest Match' | 'Good Fit' | 'Consider This';
          
          if (cutoffDiff <= 2) {
            matchType = 'Closest Match';
          } else if (cutoffDiff <= 5) {
            matchType = 'Good Fit';
          } else if (cutoffDiff <= 10) {
            matchType = 'Consider This';
          } else {
            return null; // Don't include if difference is too high
          }

          return {
            ...record,
            matchType,
            cutoffDifference: cutoffDiff
          };
        }).filter((result): result is SearchResult => result !== null);

        // Sort by match quality and then by cutoff difference
        searchResults.sort((a, b) => {
          const matchOrder = { 'Closest Match': 0, 'Good Fit': 1, 'Consider This': 2 };
          const aOrder = matchOrder[a.matchType];
          const bOrder = matchOrder[b.matchType];
          
          if (aOrder !== bOrder) {
            return aOrder - bOrder;
          }
          
          return a.cutoffDifference - b.cutoffDifference;
        });

        resolve(searchResults);
      };
    });
  }

  async getStatistics() {
    if (!this.db) await this.initDB();
    
    const records = await this.getAllRecords();
    
    if (records.length === 0) {
      return {
        totalRecords: 0,
        totalColleges: 0,
        totalBranches: 0,
        totalDistricts: 0,
        categories: [],
        avgCutoff: 0
      };
    }

    const uniqueColleges = new Set(records.map(r => r.college_name)).size;
    const uniqueBranches = new Set(records.map(r => r.branch_name)).size;
    const uniqueDistricts = new Set(records.map(r => r.district)).size;
    const categories = await this.getUniqueValues('category');
    const avgCutoff = records.reduce((sum, r) => sum + r.cutoff_mark, 0) / records.length;

    return {
      totalRecords: records.length,
      totalColleges: uniqueColleges,
      totalBranches: uniqueBranches,
      totalDistricts: uniqueDistricts,
      categories,
      avgCutoff: Math.round(avgCutoff * 100) / 100
    };
  }

  async hasData(): Promise<boolean> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.count();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result > 0);
    });
  }
}

export const indexedDBService = new IndexedDBService();