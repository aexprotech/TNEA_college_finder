/*
  # Drop and recreate college_records table

  1. Drop existing table
    - Removes all data and structure
    - Cascades to remove any dependent objects

  2. Recreate table with same structure
    - All columns with proper data types
    - Primary key and constraints
    - Default values where appropriate

  3. Security
    - Enable RLS
    - Recreate all policies for public read and authenticated write

  4. Performance
    - Recreate all indexes for fast searching
*/

-- Drop the existing table (this removes all data)
DROP TABLE IF EXISTS college_records CASCADE;

-- Recreate the table with exact same structure as before
CREATE TABLE college_records (
  id text PRIMARY KEY,
  year bigint,
  college_code bigint,
  college_name text,
  branch_code text,
  branch_name text,
  category text,
  cutoff_mark double precision,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  district text,
  location text,
  institute_type text,
  quota text,
  gender text,
  opening_rank text,
  closing_rank text,
  ranking text,
  state text
);

-- Enable Row Level Security
ALTER TABLE college_records ENABLE ROW LEVEL SECURITY;

-- Recreate all policies
CREATE POLICY "Anyone can read college records"
  ON college_records
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert college records"
  ON college_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update college records"
  ON college_records
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_college_records_cutoff ON college_records(cutoff_mark);
CREATE INDEX IF NOT EXISTS idx_college_records_category ON college_records(category);
CREATE INDEX IF NOT EXISTS idx_college_records_district ON college_records(district);
CREATE INDEX IF NOT EXISTS idx_college_records_branch ON college_records(branch_name);
CREATE INDEX IF NOT EXISTS idx_college_records_year ON college_records(year);
CREATE INDEX IF NOT EXISTS idx_college_records_college_code ON college_records(college_code);