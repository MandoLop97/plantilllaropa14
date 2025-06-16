-- Add notificado column to ordenes table
ALTER TABLE ordenes ADD COLUMN IF NOT EXISTS notificado boolean DEFAULT false;
ALTER TABLE items ADD COLUMN IF NOT EXISTS notificado boolean DEFAULT false;
