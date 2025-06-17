
-- Función para sincronizar el conteo de vistas desde vistas_diarias a negocios
CREATE OR REPLACE FUNCTION public.sync_business_views_count(p_negocio_id uuid)
RETURNS integer AS $$
DECLARE
  total_views INTEGER;
BEGIN
  -- Contar todas las vistas diarias para el negocio
  SELECT COUNT(*) INTO total_views
  FROM public.vistas_diarias 
  WHERE negocio_id = p_negocio_id;
  
  -- Actualizar la columna vistas en la tabla negocios
  UPDATE public.negocios 
  SET vistas = total_views
  WHERE id = p_negocio_id;
  
  -- Retornar el total de vistas
  RETURN total_views;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Otorgar permisos de ejecución
GRANT EXECUTE ON FUNCTION public.sync_business_views_count(uuid) TO anon, authenticated;
