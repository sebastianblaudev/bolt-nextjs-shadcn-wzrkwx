-- Eliminar tablas y políticas existentes
DROP POLICY IF EXISTS "Allow anonymous read access" ON users;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON products;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON transactions;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON cash_movements;

DROP TABLE IF EXISTS cash_movements;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de usuarios (users)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'seller')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de productos (products)
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    buy_price INTEGER NOT NULL CHECK (buy_price >= 0),
    sell_price INTEGER NOT NULL CHECK (sell_price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de transacciones (transactions)
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price INTEGER NOT NULL CHECK (price >= 0),
    total INTEGER NOT NULL CHECK (total >= 0),
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id TEXT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de movimientos de caja (cash_movements)
CREATE TABLE cash_movements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('ingreso', 'egreso', 'apertura', 'cierre')),
    amount INTEGER NOT NULL CHECK (amount >= 0),
    description TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id TEXT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_cash_movements_date ON cash_movements(date);
CREATE INDEX idx_cash_movements_user_id ON cash_movements(user_id);

-- Insertar usuarios iniciales
INSERT INTO users (id, username, password, role) VALUES
    ('1', 'Admin', 'Admin123*', 'admin'),
    ('2', 'Vendedor1', 'Vendedor123', 'seller'),
    ('3', 'Vendedor2', 'Vendedor2123', 'seller');

-- Función para actualizar el timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar automáticamente updated_at en products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_movements ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad actualizadas
CREATE POLICY "Enable read access for all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON users
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON users
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para productos
CREATE POLICY "Enable read access for all users" ON products
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON products
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para transacciones
CREATE POLICY "Enable read access for all users" ON transactions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON transactions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON transactions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON transactions
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para movimientos de caja
CREATE POLICY "Enable read access for all users" ON cash_movements
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON cash_movements
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON cash_movements
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON cash_movements
    FOR DELETE USING (auth.role() = 'authenticated');