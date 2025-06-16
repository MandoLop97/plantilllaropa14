
-- Create tables if they don't exist

-- Check if personalizacion table exists
CREATE TABLE IF NOT EXISTS personalizacion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  negocio_id UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  color_primario VARCHAR(255) DEFAULT '#4f46e5',
  color_secundario VARCHAR(255) DEFAULT '#f59e0b',
  fuente VARCHAR(255) DEFAULT 'Inter',
  modo_oscuro BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_negocio FOREIGN KEY (negocio_id) REFERENCES negocios(id) ON DELETE CASCADE
);

-- Check if plantillas table exists
CREATE TABLE IF NOT EXISTS plantillas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  categoria VARCHAR(255) NOT NULL,
  descripcion TEXT,
  preview_url VARCHAR(255),
  es_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Check if ingresos table exists
CREATE TABLE IF NOT EXISTS ingresos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  negocio_id UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  producto_id UUID REFERENCES productos(id) ON DELETE SET NULL,
  servicio_id UUID REFERENCES servicios(id) ON DELETE SET NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10,2) NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'completado',
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_producto_o_servicio CHECK (
    (producto_id IS NOT NULL AND servicio_id IS NULL) OR 
    (producto_id IS NULL AND servicio_id IS NOT NULL)
  )
);

-- Check if escritorio table exists
CREATE TABLE IF NOT EXISTS estadisticas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  negocio_id UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  vistas_sitio INT DEFAULT 0,
  vistas_catalogo INT DEFAULT 0,
  citas_totales INT DEFAULT 0,
  ventas_mes DECIMAL(12,2) DEFAULT 0.0,
  ingresos_mes DECIMAL(12,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(negocio_id, fecha)
);

-- Set up Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE IF EXISTS negocios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS personalizacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS plantillas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ingresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS estadisticas ENABLE ROW LEVEL SECURITY;

-- Create policies for negocios
CREATE POLICY "Users can view their own negocio" ON negocios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own negocio" ON negocios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own negocio" ON negocios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own negocio" ON negocios
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for personalizacion
CREATE POLICY "Users can view their own personalizacion" ON personalizacion
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = personalizacion.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert personalizacion for their negocio" ON personalizacion
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM negocios WHERE id = personalizacion.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update personalizacion for their negocio" ON personalizacion
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = personalizacion.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete personalizacion for their negocio" ON personalizacion
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = personalizacion.negocio_id AND user_id = auth.uid())
  );

-- Create policies for clientes
CREATE POLICY "Users can view clientes for their negocio" ON clientes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = clientes.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert clientes for their negocio" ON clientes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM negocios WHERE id = clientes.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update clientes for their negocio" ON clientes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = clientes.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete clientes for their negocio" ON clientes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = clientes.negocio_id AND user_id = auth.uid())
  );

-- Create policies for citas
CREATE POLICY "Users can view citas for their negocio" ON citas
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = citas.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert citas for their negocio" ON citas
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM negocios WHERE id = citas.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update citas for their negocio" ON citas
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = citas.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete citas for their negocio" ON citas
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = citas.negocio_id AND user_id = auth.uid())
  );

-- Create policies for servicios
CREATE POLICY "Users can view servicios for their negocio" ON servicios
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = servicios.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert servicios for their negocio" ON servicios
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM negocios WHERE id = servicios.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update servicios for their negocio" ON servicios
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = servicios.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete servicios for their negocio" ON servicios
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = servicios.negocio_id AND user_id = auth.uid())
  );

-- Create policies for productos
CREATE POLICY "Users can view productos for their negocio" ON productos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = productos.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert productos for their negocio" ON productos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM negocios WHERE id = productos.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update productos for their negocio" ON productos
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = productos.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete productos for their negocio" ON productos
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = productos.negocio_id AND user_id = auth.uid())
  );

-- Create policies for ingresos
CREATE POLICY "Users can view ingresos for their negocio" ON ingresos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = ingresos.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert ingresos for their negocio" ON ingresos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM negocios WHERE id = ingresos.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update ingresos for their negocio" ON ingresos
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = ingresos.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete ingresos for their negocio" ON ingresos
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = ingresos.negocio_id AND user_id = auth.uid())
  );

-- Create policies for estadisticas
CREATE POLICY "Users can view estadisticas for their negocio" ON estadisticas
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = estadisticas.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert estadisticas for their negocio" ON estadisticas
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM negocios WHERE id = estadisticas.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update estadisticas for their negocio" ON estadisticas
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = estadisticas.negocio_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete estadisticas for their negocio" ON estadisticas
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM negocios WHERE id = estadisticas.negocio_id AND user_id = auth.uid())
  );

-- Create policies for plantillas
CREATE POLICY "Everyone can view plantillas" ON plantillas
  FOR SELECT USING (true);

-- Only admins can modify plantillas (this would need to be extended with an admin check)
CREATE POLICY "Only admins can insert plantillas" ON plantillas
  FOR INSERT WITH CHECK (false);

CREATE POLICY "Only admins can update plantillas" ON plantillas
  FOR UPDATE USING (false);

CREATE POLICY "Only admins can delete plantillas" ON plantillas
  FOR DELETE USING (false);
