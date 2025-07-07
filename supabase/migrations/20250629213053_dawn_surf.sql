/*
  # Drop and recreate college_data table

  1. Drop existing table
    - Drop the college_data table completely
    - This will remove all data, indexes, and triggers

  2. Recreate table with same structure
    - Recreate college_data table with identical structure
    - Add all indexes and policies back
    - Add trigger for updated_at

  3. Security
    - Enable RLS
    - Add public read policy
    - Add authenticated insert/update policies
*/

-- Drop the existing table (this removes all data)
DROP TABLE IF EXISTS college_data CASCADE;

-- Recreate the table with exact same structure
CREATE TABLE college_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id text UNIQUE,
  year integer NOT NULL,
  college_code integer NOT NULL,
  college_name text NOT NULL,
  branch_code text NOT NULL,
  branch_name text NOT NULL,
  category text NOT NULL,
  cutoff_mark numeric(5,2) NOT NULL,
  district text NOT NULL,
  location text,
  institute_type text DEFAULT 'Engineering',
  quota text DEFAULT 'Tamil Nadu State',
  gender text DEFAULT 'Common',
  opening_rank integer,
  closing_rank integer,
  ranking text DEFAULT 'Not Ranked',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE college_data ENABLE ROW LEVEL SECURITY;

-- Recreate all policies
CREATE POLICY "Anyone can read college data"
  ON college_data
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert college data"
  ON college_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update college data"
  ON college_data
  FOR UPDATE
  TO authenticated
  USING (true);

-- Recreate all indexes
CREATE INDEX idx_college_data_cutoff ON college_data(cutoff_mark);
CREATE INDEX idx_college_data_category ON college_data(category);
CREATE INDEX idx_college_data_district ON college_data(district);
CREATE INDEX idx_college_data_branch ON college_data(branch_name);
CREATE INDEX idx_college_data_year ON college_data(year);
CREATE INDEX idx_college_data_college_code ON college_data(college_code);

-- Recreate the trigger for updated_at
CREATE TRIGGER update_college_data_updated_at
    BEFORE UPDATE ON college_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();