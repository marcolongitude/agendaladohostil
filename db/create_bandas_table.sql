-- Criar tabela de bandas
CREATE TABLE IF NOT EXISTS bandas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  genero TEXT NOT NULL,
  criador_id UUID NOT NULL REFERENCES musicos(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_bandas_id ON bandas(id);
CREATE INDEX IF NOT EXISTS idx_bandas_criador_id ON bandas(criador_id);

-- Habilitar RLS
ALTER TABLE bandas ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança apenas se não existirem
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bandas' AND policyname = 'Acesso público a bandas') THEN
        CREATE POLICY "Acesso público a bandas" ON bandas FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bandas' AND policyname = 'Criar banda') THEN
        CREATE POLICY "Criar banda" ON bandas FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bandas' AND policyname = 'Atualizar banda') THEN
        CREATE POLICY "Atualizar banda" ON bandas FOR UPDATE USING (criador_id = auth.uid());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bandas' AND policyname = 'Deletar banda') THEN
        CREATE POLICY "Deletar banda" ON bandas FOR DELETE USING (criador_id = auth.uid());
    END IF;
END $$;

-- Criar tabela de membros de banda
CREATE TABLE IF NOT EXISTS membros_banda (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  musico_id UUID NOT NULL REFERENCES musicos(id) ON DELETE CASCADE,
  banda_id UUID NOT NULL REFERENCES bandas(id) ON DELETE CASCADE,
  instrumento TEXT NOT NULL,
  papel TEXT NOT NULL DEFAULT 'membro' CHECK (papel IN ('admin', 'membro')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(musico_id, banda_id)
);

-- Habilitar RLS na tabela membros_banda
ALTER TABLE membros_banda ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança para membros_banda
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'membros_banda' AND policyname = 'Acesso público a membros de banda') THEN
        CREATE POLICY "Acesso público a membros de banda" ON membros_banda FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'membros_banda' AND policyname = 'Criar membro de banda') THEN
        CREATE POLICY "Criar membro de banda" ON membros_banda FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'membros_banda' AND policyname = 'Atualizar membro de banda') THEN
        CREATE POLICY "Atualizar membro de banda" ON membros_banda FOR UPDATE USING (musico_id = auth.uid());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'membros_banda' AND policyname = 'Deletar membro de banda') THEN
        CREATE POLICY "Deletar membro de banda" ON membros_banda FOR DELETE USING (musico_id = auth.uid());
    END IF;
END $$; 

-- Criar tabela de convites para bandas
CREATE TABLE IF NOT EXISTS convites_banda (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  banda_id UUID NOT NULL REFERENCES bandas(id) ON DELETE CASCADE,
  email TEXT,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceito', 'expirado')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ
);

-- Índice para busca rápida por token
CREATE INDEX IF NOT EXISTS idx_convites_banda_token ON convites_banda(token);

-- Habilitar RLS na tabela convites_banda
ALTER TABLE convites_banda ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de RLS para convites_banda
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'convites_banda' AND policyname = 'Acesso público a convites') THEN
        CREATE POLICY "Acesso público a convites" ON convites_banda FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'convites_banda' AND policyname = 'Criar convite') THEN
        CREATE POLICY "Criar convite" ON convites_banda FOR INSERT WITH CHECK (true);
    END IF;
END $$; 