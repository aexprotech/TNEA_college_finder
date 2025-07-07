/*
  # Create college data table for Tamil Nadu engineering colleges

  1. New Tables
    - `college_data`
      - `id` (uuid, primary key) - unique identifier from CSV
      - `year` (integer) - admission year
      - `college_code` (integer) - college identification code
      - `college_name` (text) - full college name with address
      - `branch_code` (text) - branch/course code
      - `branch_name` (text) - full branch/course name
      - `category` (text) - admission category (BCM, etc.)
      - `cutoff_mark` (decimal) - cutoff marks for admission
      - `district` (text) - district location
      - `location` (text) - specific location details
      - `institute_type` (text) - type of institute
      - `quota` (text) - quota type
      - `gender` (text) - gender category
      - `opening_rank` (integer) - opening rank (nullable)
      - `closing_rank` (integer) - closing rank (nullable)
      - `ranking` (text) - NIRF or other ranking
      - `created_at` (timestamp) - record creation time
      - `updated_at` (timestamp) - record update time

  2. Security
    - Enable RLS on `college_data` table
    - Add policy for public read access (since this is public college data)
    - Add policy for authenticated users to insert/update data

  3. Indexes
    - Add indexes for common search fields (cutoff_mark, category, district, branch_name)
*/

CREATE TABLE IF NOT EXISTS college_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id text UNIQUE,
  year integer NOT NULL,
  college_code integer NOT NULL,
  college_name text NOT NULL,
  branch_code text NOT NULL,
  branch_name text NOT NULL,
  category text NOT NULL,
  cutoff_mark decimal(5,2) NOT NULL,
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

-- Policy for public read access (college data is public information)
CREATE POLICY "Anyone can read college data"
  ON college_data
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert data
CREATE POLICY "Authenticated users can insert college data"
  ON college_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users to update data
CREATE POLICY "Authenticated users can update college data"
  ON college_data
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_college_data_cutoff ON college_data(cutoff_mark);
CREATE INDEX IF NOT EXISTS idx_college_data_category ON college_data(category);
CREATE INDEX IF NOT EXISTS idx_college_data_district ON college_data(district);
CREATE INDEX IF NOT EXISTS idx_college_data_branch ON college_data(branch_name);
CREATE INDEX IF NOT EXISTS idx_college_data_year ON college_data(year);
CREATE INDEX IF NOT EXISTS idx_college_data_college_code ON college_data(college_code);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_college_data_updated_at
    BEFORE UPDATE ON college_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();