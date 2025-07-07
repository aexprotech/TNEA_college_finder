/*
  # Add RLS policies for college_records table

  1. Security Policies
    - Enable public read access for college_records table (since this is public college data)
    - Add policy for authenticated users to insert/update data
    - Add policy for authenticated users to delete data (if needed)

  2. Notes
    - College admission data is public information, so read access should be available to everyone
    - Only authenticated users should be able to modify data
    - This matches the pattern used in the college_data table
*/

-- Policy for public read access (college data is public information)
CREATE POLICY "Anyone can read college records"
  ON college_records
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert data
CREATE POLICY "Authenticated users can insert college records"
  ON college_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users to update data
CREATE POLICY "Authenticated users can update college records"
  ON college_records
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy for authenticated users to delete data (optional, uncomment if needed)
-- CREATE POLICY "Authenticated users can delete college records"
--   ON college_records
--   FOR DELETE
--   TO authenticated
--   USING (true);