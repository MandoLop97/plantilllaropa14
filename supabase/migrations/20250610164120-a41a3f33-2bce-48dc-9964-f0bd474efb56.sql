
-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "ordenes_select_authenticated" ON ordenes;
DROP POLICY IF EXISTS "ordenes_insert_authenticated" ON ordenes;
DROP POLICY IF EXISTS "ordenes_update_authenticated" ON ordenes;
DROP POLICY IF EXISTS "ordenes_delete_authenticated" ON ordenes;
DROP POLICY IF EXISTS "ordenes_insert_public" ON ordenes;

-- Habilitar RLS en la tabla ordenes si no está habilitado
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios autenticados puedan ver todas las órdenes
CREATE POLICY "ordenes_select_authenticated"
    ON ordenes
    FOR SELECT
    TO authenticated
    USING (auth.role() = 'authenticated');

-- Política para que usuarios autenticados puedan insertar órdenes
CREATE POLICY "ordenes_insert_authenticated"
    ON ordenes
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.role() = 'authenticated');

-- Política para que usuarios autenticados puedan actualizar órdenes
CREATE POLICY "ordenes_update_authenticated"
    ON ordenes
    FOR UPDATE
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Política para que usuarios autenticados puedan eliminar órdenes
CREATE POLICY "ordenes_delete_authenticated"
    ON ordenes
    FOR DELETE
    TO authenticated
    USING (auth.role() = 'authenticated');

-- Política para que usuarios públicos (anónimos) puedan insertar órdenes al hacer compras
CREATE POLICY "ordenes_insert_public"
    ON ordenes
    FOR INSERT
    TO public
    WITH CHECK (auth.role() = 'anon');
