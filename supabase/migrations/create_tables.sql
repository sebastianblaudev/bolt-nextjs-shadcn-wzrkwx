-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  buy_price INTEGER NOT NULL,
  sell_price INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  branch_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  total INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id TEXT NOT NULL,
  branch_id TEXT NOT NULL
);

-- Create cash_movements table
CREATE TABLE cash_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('ingreso', 'egreso', 'apertura', 'cierre')),
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id TEXT NOT NULL,
  branch_id TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_products_branch_id ON products(branch_id);
CREATE INDEX idx_transactions_branch_id ON transactions(branch_id);
CREATE INDEX idx_cash_movements_branch_id ON cash_movements(branch_id);