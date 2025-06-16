-- Add vistas column to negocios
ALTER TABLE negocios ADD COLUMN IF NOT EXISTS vistas bigint DEFAULT 0;

-- Function to increment views atomically
CREATE OR REPLACE FUNCTION public.increment_negocio_vistas(n_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE negocios
  SET vistas = COALESCE(vistas, 0) + 1
  WHERE id = n_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.increment_negocio_vistas(uuid) TO anon, authenticated;
