
-- Eliminar todas las políticas existentes en la tabla ordenes
DROP POLICY IF EXISTS "ordenes_select_authenticated" ON ordenes;
DROP POLICY IF EXISTS "ordenes_insert_authenticated" ON ordenes;
DROP POLICY IF EXISTS "ordenes_update_authenticated" ON ordenes;
DROP POLICY IF EXISTS "ordenes_delete_authenticated" ON ordenes;
DROP POLICY IF EXISTS "ordenes_insert_public" ON ordenes;
DROP POLICY IF EXISTS "ordenes_insert_all" ON ordenes;

-- Habilitar RLS en la tabla ordenes si no está habilitado
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios autenticados puedan ver todas las órdenes
CREATE POLICY "ordenes_select_authenticated"
    ON ordenes
    FOR SELECT
    TO authenticated
    USING (true);

-- Política unificada para inserción: permite tanto usuarios autenticados como anónimos
CREATE POLICY "ordenes_insert_all"
    ON ordenes
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

-- Política para que usuarios autenticados puedan actualizar órdenes
CREATE POLICY "ordenes_update_authenticated"
    ON ordenes
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Política para que usuarios autenticados puedan eliminar órdenes
CREATE POLICY "ordenes_delete_authenticated"
    ON ordenes
    FOR DELETE
    TO authenticated
    USING (true);
