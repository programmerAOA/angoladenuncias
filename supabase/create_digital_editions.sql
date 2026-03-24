-- Script para criar as tabelas de edições digitais e compras (Versão Idempotente)
-- Execute este script no SQL Editor do seu Dashboard Supabase

-- 1. Tabela de Edições Digitais
CREATE TABLE IF NOT EXISTS public.digital_editions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    edition_date DATE NOT NULL DEFAULT CURRENT_DATE,
    price_aoa DECIMAL(12, 2) NOT NULL DEFAULT 0,
    price_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
    cover_url TEXT,
    pdf_url TEXT NOT NULL,
    is_free BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS para digital_editions
ALTER TABLE public.digital_editions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published digital editions" ON public.digital_editions;
CREATE POLICY "Anyone can view published digital editions" 
ON public.digital_editions FOR SELECT 
USING (published = true);

DROP POLICY IF EXISTS "Admins can manage digital editions" ON public.digital_editions;
CREATE POLICY "Admins can manage digital editions" 
ON public.digital_editions FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Tabela de Compras Digitais
CREATE TABLE IF NOT EXISTS public.digital_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    edition_id UUID NOT NULL REFERENCES public.digital_editions(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, edition_id)
);

-- RLS para digital_purchases
ALTER TABLE public.digital_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own purchases" ON public.digital_purchases;
CREATE POLICY "Users can view their own purchases" 
ON public.digital_purchases FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all purchases" ON public.digital_purchases;
CREATE POLICY "Admins can view all purchases" 
ON public.digital_purchases FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Configuração de Storage (Bucket para PDFs)
-- Inserir bucket se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('digital-editions', 'digital-editions', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para o bucket 'digital-editions'
DROP POLICY IF EXISTS "Admins can manage digital edition files" ON storage.objects;
CREATE POLICY "Admins can manage digital edition files"
ON storage.objects FOR ALL
USING (bucket_id = 'digital-editions' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can access their purchased digital edition files" ON storage.objects;
CREATE POLICY "Users can access their purchased digital edition files"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'digital-editions' 
    AND (
        EXISTS (
            SELECT 1 FROM public.digital_editions de
            LEFT JOIN public.digital_purchases dp ON de.id = dp.edition_id
            WHERE de.pdf_url = name 
            AND (de.is_free = true OR dp.user_id = auth.uid())
        )
    )
);

-- 4. Trigger para updated_at em digital_editions
DROP TRIGGER IF EXISTS update_digital_editions_updated_at ON public.digital_editions;
CREATE TRIGGER update_digital_editions_updated_at
    BEFORE UPDATE ON public.digital_editions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
