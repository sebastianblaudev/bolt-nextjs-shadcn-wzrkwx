-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Enable read access for all" ON users;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON users;
DROP POLICY IF EXISTS "Enable read access for all" ON products;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON products;
DROP POLICY IF EXISTS "Enable read access for all" ON transactions;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON transactions;
DROP POLICY IF EXISTS "Enable read access for all" ON cash_movements;
DROP POLICY IF EXISTS "Enable all access for authenticated" ON cash_movements;

-- Crear nuevas políticas simplificadas
CREATE POLICY "Enable access for all users" ON users
    FOR ALL USING (true);

CREATE POLICY "Enable access for all users" ON products
    FOR ALL USING (true);

CREATE POLICY "Enable access for all users" ON transactions
    FOR ALL USING (true);

CREATE POLICY "Enable access for all users" ON cash_movements
    FOR ALL USING (true);