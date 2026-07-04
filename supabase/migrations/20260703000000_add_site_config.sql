-- Create site_config table for dynamic site settings
CREATE TABLE public.site_config (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Anyone can read site config (needed for Footer, Header, etc.)
CREATE POLICY "Public can read site config"
  ON public.site_config FOR SELECT USING (true);

-- Only admins can write site config
CREATE POLICY "Admins can manage site config"
  ON public.site_config FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default values (matching current hardcoded values)
INSERT INTO public.site_config (key, value) VALUES
  ('site_name',       'Angola Sem Filtros'),
  ('site_logo_url',   ''),
  ('primary_color',   '#e11d48'),
  ('facebook_url',    'https://facebook.com/angolasemfiltros'),
  ('instagram_url',   'https://instagram.com/angolasemfiltros'),
  ('youtube_url',     'https://youtube.com/@semfiltrostv'),
  ('contact_email',   'redaccao@semfiltros.com'),
  ('whatsapp_number', '+244952679780'),
  ('copyright_text',  'Portal Sem Filtros.'),
  ('gemini_api_key',   '')
ON CONFLICT (key) DO NOTHING;
