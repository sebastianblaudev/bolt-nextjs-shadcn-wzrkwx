-- First drop existing foreign key constraints
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_product_id_fkey;
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;
ALTER TABLE cash_movements DROP CONSTRAINT IF EXISTS cash_movements_user_id_fkey;

-- Re-add foreign key constraints with CASCADE
ALTER TABLE transactions 
    ADD CONSTRAINT transactions_product_id_fkey 
    FOREIGN KEY (product_id) 
    REFERENCES products(id) 
    ON DELETE CASCADE;

ALTER TABLE transactions 
    ADD CONSTRAINT transactions_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE;

ALTER TABLE cash_movements 
    ADD CONSTRAINT cash_movements_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE;