-- Habilitar la extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Eliminar tablas existentes en orden correcto (por las dependencias)
DROP TABLE IF EXISTS cash_movements;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Crear tabla de usuarios primero (ya que otras tablas dependen de ella)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'seller')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insertar usuarios iniciales
INSERT INTO users (id, username, password, role) VALUES
    ('1', 'Admin', 'Admin123*', 'admin'),
    ('2', 'Vendedor1', 'Vendedor123', 'seller'),
    ('3', 'Vendedor2', 'Vendedor2123', 'seller');

-- Crear tabla de productos
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    buy_price INTEGER NOT NULL CHECK (buy_price >= 0),
    sell_price INTEGER NOT NULL CHECK (sell_price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de transacciones
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

-- Crear tabla de movimientos de caja
CREATE TABLE cash_movements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('ingreso', 'egreso', 'apertura', 'cierre')),
    amount INTEGER NOT NULL CHECK (amount >= 0),
    description TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id TEXT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear índices
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_cash_movements_date ON cash_movements(date);
CREATE INDEX idx_cash_movements_user_id ON cash_movements(user_id);

-- Función para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_movements ENABLE ROW LEVEL SECURITY;

-- Crear políticas
CREATE POLICY "Enable read access for all" ON users FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated" ON users FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all" ON products FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated" ON products FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all" ON transactions FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated" ON transactions FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all" ON cash_movements FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated" ON cash_movements FOR ALL USING (auth.role() = 'authenticated');