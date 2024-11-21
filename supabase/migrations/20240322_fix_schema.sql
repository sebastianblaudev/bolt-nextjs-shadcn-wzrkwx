-- Drop existing tables in correct order
DROP TABLE IF EXISTS cash_movements;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'seller')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial users
INSERT INTO users (id, username, password, role) VALUES
    ('1', 'Admin', 'Admin123*', 'admin'),
    ('2', 'Vendedor1', 'Vendedor123', 'seller'),
    ('3', 'Vendedor2', 'Vendedor2123', 'seller');

-- Create products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    buy_price INTEGER NOT NULL CHECK (buy_price >= 0),
    sell_price INTEGER NOT NULL CHECK (sell_price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create transactions table with ON DELETE CASCADE
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price INTEGER NOT NULL CHECK (price >= 0),
    total INTEGER NOT NULL CHECK (total >= 0),
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id TEXT REFERENCES users(id),
    payment_method TEXT NOT NULL DEFAULT 'efectivo' CHECK (payment_method IN ('efectivo', 'tarjeta', 'transferencia')),
    payment_amount INTEGER NOT NULL DEFAULT 0 CHECK (payment_amount >= 0),
    payment_change INTEGER DEFAULT 0 CHECK (payment_change >= 0)
);

-- Create cash_movements table
CREATE TABLE cash_movements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('ingreso', 'egreso', 'apertura', 'cierre')),
    amount INTEGER NOT NULL CHECK (amount >= 0),
    description TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id TEXT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_cash_movements_date ON cash_movements(date);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_movements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable access for all users" ON users FOR ALL USING (true);
CREATE POLICY "Enable access for all users" ON products FOR ALL USING (true);
CREATE POLICY "Enable access for all users" ON transactions FOR ALL USING (true);
CREATE POLICY "Enable access for all users" ON cash_movements FOR ALL USING (true);