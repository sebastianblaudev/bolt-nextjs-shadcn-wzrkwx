-- Modificar la tabla de transacciones para incluir información de pago
ALTER TABLE transactions
ADD COLUMN payment_method TEXT NOT NULL DEFAULT 'efectivo' CHECK (payment_method IN ('efectivo', 'tarjeta', 'transferencia')),
ADD COLUMN payment_amount INTEGER NOT NULL DEFAULT 0 CHECK (payment_amount >= 0),
ADD COLUMN payment_change INTEGER DEFAULT 0 CHECK (payment_change >= 0);