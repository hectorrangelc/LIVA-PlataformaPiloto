-- ============================================================
-- SCHEMA COMPLETO — Plataforma LIVA
-- Ejecutar en Supabase Dashboard > SQL Editor
-- Orden: respetar foreign keys
-- ============================================================

-- ── 1. TABLA: users (extiende auth.users) ──────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT,
  telefono TEXT,
  ciudad TEXT,
  estado_republica TEXT,
  foto_url TEXT,
  bio TEXT,
  rol TEXT NOT NULL DEFAULT 'user'
    CHECK (rol IN ('user', 'volunteer', 'staff', 'admin')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. TABLA: campanas (sin dependencias externas) ─────────
CREATE TABLE IF NOT EXISTS public.campanas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  historia TEXT,
  animal_id UUID, -- FK se agrega después de crear animales
  meta_mxn DECIMAL(10,2) NOT NULL,
  recaudado_mxn DECIMAL(10,2) DEFAULT 0,
  activa BOOLEAN DEFAULT true,
  urgente BOOLEAN DEFAULT false,
  imagen_url TEXT,
  fecha_limite DATE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. TABLA: animales ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.animales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  especie TEXT NOT NULL CHECK (especie IN ('perro', 'gato', 'otro')),
  raza_estimada TEXT,
  edad_meses INTEGER,
  categoria_edad TEXT CHECK (categoria_edad IN ('cachorro','joven','adulto','senior')),
  peso_kg DECIMAL(5,2),
  sexo TEXT CHECK (sexo IN ('macho', 'hembra')),
  esterilizado BOOLEAN DEFAULT false,
  estado TEXT NOT NULL DEFAULT 'disponible'
    CHECK (estado IN ('disponible','en_proceso','adoptado','cuarentena',
                      'tratamiento_medico','fallecido','en_transito')),
  historia TEXT,
  personalidad TEXT,
  necesidades_especiales TEXT,
  compatible_ninos BOOLEAN DEFAULT true,
  compatible_animales BOOLEAN DEFAULT true,
  apto_departamento BOOLEAN DEFAULT true,
  fotos TEXT[] DEFAULT '{}',
  foto_principal TEXT,
  fecha_ingreso DATE DEFAULT CURRENT_DATE,
  ciudad_rescate TEXT,
  foster_id UUID REFERENCES public.users(id),
  apadrinado BOOLEAN DEFAULT false,
  urgente BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agregar FK de campanas → animales ahora que animales existe
ALTER TABLE public.campanas
  ADD CONSTRAINT campanas_animal_id_fkey
  FOREIGN KEY (animal_id) REFERENCES public.animales(id);

-- ── 4. TABLA: historial_medico ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.historial_medico (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID REFERENCES public.animales(id) ON DELETE CASCADE NOT NULL,
  fecha DATE NOT NULL,
  tipo TEXT NOT NULL
    CHECK (tipo IN ('consulta','vacuna','cirugia','desparasitacion',
                    'laboratorio','tratamiento','revision')),
  descripcion TEXT NOT NULL,
  veterinario TEXT,
  costo_mxn DECIMAL(10,2),
  adjuntos TEXT[] DEFAULT '{}',
  notas TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. TABLA: solicitudes_adopcion ────────────────────────
CREATE TABLE IF NOT EXISTS public.solicitudes_adopcion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID REFERENCES public.animales(id) NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  estado TEXT NOT NULL DEFAULT 'recibida'
    CHECK (estado IN ('recibida','en_revision','visita_programada',
                      'aprobada','en_espera','denegada','contrato_firmado','completada')),
  -- Datos del formulario
  vivienda_tipo TEXT CHECK (vivienda_tipo IN ('propia','arrendada')),
  vivienda_m2 INTEGER,
  vivienda_exterior BOOLEAN,
  num_adultos INTEGER,
  num_ninos INTEGER,
  edades_ninos TEXT,
  mascotas_actuales TEXT,
  experiencia_previa TEXT,
  motivacion TEXT,
  referencias TEXT,
  -- Documentos adjuntos (URLs de Supabase Storage)
  doc_identificacion TEXT,
  doc_domicilio TEXT,
  -- Seguimiento administrativo
  notas_admin TEXT,
  motivo_denegacion TEXT,
  fecha_visita TIMESTAMPTZ,
  fecha_entrega DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. TABLA: donaciones ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.donaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  monto_mxn DECIMAL(10,2) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('unica','recurrente')),
  canal TEXT NOT NULL CHECK (canal IN ('mercadopago','transferencia','efectivo','otro')),
  campana_id UUID REFERENCES public.campanas(id),
  animal_id UUID REFERENCES public.animales(id),
  estado TEXT DEFAULT 'completada'
    CHECK (estado IN ('pendiente','completada','fallida','reembolsada')),
  referencia_pago TEXT,
  comprobante_url TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 7. TABLA: apadrinamientos ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.apadrinamientos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  animal_id UUID REFERENCES public.animales(id) NOT NULL,
  monto_mensual_mxn DECIMAL(10,2) NOT NULL,
  activo BOOLEAN DEFAULT true,
  suscripcion_id TEXT,
  fecha_inicio DATE DEFAULT CURRENT_DATE,
  fecha_fin DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, animal_id)
);

-- ── 8. TABLA: eventos ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL
    CHECK (tipo IN ('adopcion','esterilizacion','recaudacion','voluntariado','otro')),
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ,
  lugar TEXT NOT NULL,
  direccion TEXT,
  ciudad TEXT,
  imagen_url TEXT,
  capacidad INTEGER,
  activo BOOLEAN DEFAULT true,
  resultados TEXT,
  fotos_post TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 9. TABLA: registros_evento ────────────────────────────
CREATE TABLE IF NOT EXISTS public.registros_evento (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  evento_id UUID REFERENCES public.eventos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  confirmado BOOLEAN DEFAULT false,
  asistio BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(evento_id, user_id)
);

-- ── 10. TABLA: posts_comunidad ────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts_comunidad (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  categoria TEXT CHECK (categoria IN ('rescate','exito','novedad','evento','voluntariado')),
  imagen_url TEXT,
  autor_id UUID REFERENCES public.users(id),
  publicado BOOLEAN DEFAULT false,
  destacado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 11. TABLA: suscriptores_newsletter ───────────────────
CREATE TABLE IF NOT EXISTS public.suscriptores_newsletter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT,
  segmento TEXT DEFAULT 'general'
    CHECK (segmento IN ('general','voluntarios','adoptantes','donadores')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 12. TABLA: animales_favoritos ────────────────────────
CREATE TABLE IF NOT EXISTS public.animales_favoritos (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  animal_id UUID REFERENCES public.animales(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, animal_id)
);

-- ============================================================
-- ÍNDICES DE PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_animales_estado   ON public.animales(estado);
CREATE INDEX IF NOT EXISTS idx_animales_especie  ON public.animales(especie);
CREATE INDEX IF NOT EXISTS idx_animales_visible  ON public.animales(visible);
CREATE INDEX IF NOT EXISTS idx_animales_urgente  ON public.animales(urgente);
CREATE INDEX IF NOT EXISTS idx_animales_ciudad   ON public.animales(ciudad_rescate);
CREATE INDEX IF NOT EXISTS idx_solicitudes_user  ON public.solicitudes_adopcion(user_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_animal ON public.solicitudes_adopcion(animal_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON public.solicitudes_adopcion(estado);
CREATE INDEX IF NOT EXISTS idx_donaciones_user   ON public.donaciones(user_id);
CREATE INDEX IF NOT EXISTS idx_donaciones_campana ON public.donaciones(campana_id);
CREATE INDEX IF NOT EXISTS idx_historial_animal  ON public.historial_medico(animal_id);
CREATE INDEX IF NOT EXISTS idx_eventos_fecha     ON public.eventos(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_posts_publicado   ON public.posts_comunidad(publicado);

-- ============================================================
-- ROW LEVEL SECURITY — Habilitar en todas las tablas
-- ============================================================
ALTER TABLE public.users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animales              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial_medico      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_adopcion  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donaciones            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apadrinamientos       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campanas              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_evento      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts_comunidad       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suscriptores_newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animales_favoritos    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS RLS
-- ============================================================

-- ── USERS ──────────────────────────────────────────────────
-- Usuario ve y edita solo su propio perfil
CREATE POLICY "users_ver_propio" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_editar_propio" ON public.users
  FOR UPDATE USING (id = auth.uid());

-- Admin ve y edita todos los usuarios
CREATE POLICY "users_admin_todo" ON public.users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol IN ('admin', 'staff'))
  );

-- Inserción automática (solo via trigger)
CREATE POLICY "users_insertar_trigger" ON public.users
  FOR INSERT WITH CHECK (id = auth.uid());

-- ── ANIMALES ───────────────────────────────────────────────
-- Lectura pública de animales visibles
CREATE POLICY "animales_lectura_publica" ON public.animales
  FOR SELECT USING (visible = true);

-- Admin/staff/volunteer ven todos incluyendo no visibles
CREATE POLICY "animales_ver_staff" ON public.animales
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol IN ('admin', 'staff', 'volunteer'))
  );

-- Solo admin/staff pueden crear, editar, eliminar
CREATE POLICY "animales_escritura_admin" ON public.animales
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol IN ('admin', 'staff'))
  );

-- ── HISTORIAL MÉDICO ───────────────────────────────────────
-- Solo admin/staff/volunteer pueden ver y modificar
CREATE POLICY "historial_staff" ON public.historial_medico
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol IN ('admin', 'staff', 'volunteer'))
  );

-- ── SOLICITUDES DE ADOPCIÓN ───────────────────────────────
-- Usuario autenticado ve solo sus propias solicitudes
CREATE POLICY "solicitudes_ver_propias" ON public.solicitudes_adopcion
  FOR SELECT USING (user_id = auth.uid());

-- Usuario autenticado puede crear solicitudes
CREATE POLICY "solicitudes_crear" ON public.solicitudes_adopcion
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admin/staff ven y modifican todas
CREATE POLICY "solicitudes_admin" ON public.solicitudes_adopcion
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol IN ('admin', 'staff'))
  );

-- ── DONACIONES ─────────────────────────────────────────────
-- Usuario ve sus propias donaciones
CREATE POLICY "donaciones_ver_propias" ON public.donaciones
  FOR SELECT USING (user_id = auth.uid());

-- Cualquiera puede crear donación (anónimas incluidas)
CREATE POLICY "donaciones_crear" ON public.donaciones
  FOR INSERT WITH CHECK (true);

-- Solo admin ve y modifica todas
CREATE POLICY "donaciones_admin" ON public.donaciones
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol IN ('admin'))
  );

-- ── APADRINAMIENTOS ────────────────────────────────────────
CREATE POLICY "apadrinamientos_ver_propios" ON public.apadrinamientos
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "apadrinamientos_crear" ON public.apadrinamientos
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "apadrinamientos_admin" ON public.apadrinamientos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol IN ('admin', 'staff'))
  );

-- ── CAMPAÑAS ───────────────────────────────────────────────
-- Lectura pública de campañas activas
CREATE POLICY "campanas_lectura_publica" ON public.campanas
  FOR SELECT USING (activa = true);

-- Admin/staff gestionan campañas
CREATE POLICY "campanas_admin" ON public.campanas
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol IN ('admin', 'staff'))
  );

-- ── EVENTOS ────────────────────────────────────────────────
-- Lectura pública de eventos activos
CREATE POLICY "eventos_lectura_publica" ON public.eventos
  FOR SELECT USING (activo = true);

-- Admin gestiona eventos
CREATE POLICY "eventos_admin" ON public.eventos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol IN ('admin', 'staff'))
  );

-- ── REGISTROS DE EVENTO ────────────────────────────────────
CREATE POLICY "registros_ver_propios" ON public.registros_evento
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "registros_crear" ON public.registros_evento
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "registros_admin" ON public.registros_evento
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol IN ('admin', 'staff'))
  );

-- ── POSTS COMUNIDAD ────────────────────────────────────────
-- Lectura pública de posts publicados
CREATE POLICY "posts_lectura_publica" ON public.posts_comunidad
  FOR SELECT USING (publicado = true);

-- Admin/staff gestionan posts
CREATE POLICY "posts_admin" ON public.posts_comunidad
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol IN ('admin', 'staff'))
  );

-- ── NEWSLETTER ─────────────────────────────────────────────
-- Cualquiera puede suscribirse
CREATE POLICY "newsletter_suscribir" ON public.suscriptores_newsletter
  FOR INSERT WITH CHECK (true);

-- Solo admin gestiona suscriptores
CREATE POLICY "newsletter_admin" ON public.suscriptores_newsletter
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol IN ('admin', 'staff'))
  );

-- ── FAVORITOS ──────────────────────────────────────────────
CREATE POLICY "favoritos_ver_propios" ON public.animales_favoritos
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "favoritos_gestionar" ON public.animales_favoritos
  FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- TRIGGER: Crear perfil en public.users al registrarse
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nombre, apellido)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'apellido'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si ya existe y recrear
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_animales_updated_at
  BEFORE UPDATE ON public.animales
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_solicitudes_updated_at
  BEFORE UPDATE ON public.solicitudes_adopcion
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_campanas_updated_at
  BEFORE UPDATE ON public.campanas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON public.posts_comunidad
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
