-- This script sets up the admin table and a default user.
-- Please run this in your Supabase SQL Editor to fix the login issue.

-- 1. Create the Admin table
CREATE TABLE IF NOT EXISTS admin (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Storing plain text for this demo. Use a hashed password in production.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
-- This is important to prevent unauthorized access.
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy to allow public read access
-- This is NOT recommended for production but is needed for this simplified client-side auth.
-- A better approach is to use Supabase Auth or a serverless function.
-- Drop the policy if it exists to avoid errors on re-run
DROP POLICY IF EXISTS "Public read access to admin" ON admin;
CREATE POLICY "Public read access to admin"
ON admin FOR SELECT
USING (true);

-- 4. Insert a default admin user
-- You can change these credentials.
-- This will fail if the user 'admin' already exists, which is fine.
INSERT INTO admin (username, password)
VALUES ('admin', 'password')
ON CONFLICT (username) DO NOTHING;

-- After running this, you should be able to log in with:
-- Username: admin
-- Password: password
