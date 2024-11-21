-- Add branch_id column to products table
ALTER TABLE products
ADD COLUMN branch_id TEXT NOT NULL DEFAULT 'branch-1';

-- Add branch_id column to transactions table
ALTER TABLE transactions
ADD COLUMN branch_id TEXT NOT NULL DEFAULT 'branch-1';

-- Add branch_id column to cash_movements table
ALTER TABLE cash_movements
ADD COLUMN branch_id TEXT NOT NULL DEFAULT 'branch-1';

-- Add user_id column to transactions table
ALTER TABLE transactions
ADD COLUMN user_id TEXT NOT NULL DEFAULT '1';

-- Add user_id column to cash_movements table
ALTER TABLE cash_movements
ADD COLUMN user_id TEXT NOT NULL DEFAULT '1';