import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CollegeData {
  id: string;
  college_code: number;
  college_name: string;
  branch_code: string;
  branch_name: string;
  category: string;
  cutoff_mark_2023?: number | string | null;  // Can be number, string, or null
  cutoff_mark_2024?: number | string | null;  // Can be number, string, or null
  district: string;
  location?: string;
  institute_type?: string;
  quota?: string;
  gender?: string;
  opening_rank?: number | string | null;
  closing_rank?: number | string | null;
  ranking?: string;
  created_at?: string;
  updated_at?: string;
  // Removed fields that no longer exist in new structure:
  // original_id?: string;
  // year: number;
  // cutoff_mark: number;
}