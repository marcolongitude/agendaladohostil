-- Adicionar novas colunas à tabela bandas se elas não existirem
DO $$ 
BEGIN
    -- Adicionar coluna cidade se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bandas' AND column_name = 'cidade') THEN
        ALTER TABLE bandas ADD COLUMN cidade TEXT NOT NULL DEFAULT '';
    END IF;

    -- Adicionar coluna estado se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bandas' AND column_name = 'estado') THEN
        ALTER TABLE bandas ADD COLUMN estado TEXT NOT NULL DEFAULT '';
    END IF;

    -- Adicionar coluna genero se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bandas' AND column_name = 'genero') THEN
        ALTER TABLE bandas ADD COLUMN genero TEXT NOT NULL DEFAULT '';
    END IF;

    -- Adicionar coluna criador_id se não existir (primeiro como nullable)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bandas' AND column_name = 'criador_id') THEN
        ALTER TABLE bandas ADD COLUMN criador_id UUID REFERENCES musicos(id);
        
        -- Atualizar registros existentes com um criador padrão
        WITH primeiro_musico AS (
            SELECT id FROM musicos ORDER BY created_at LIMIT 1
        )
        UPDATE bandas 
        SET criador_id = (SELECT id FROM primeiro_musico)
        WHERE criador_id IS NULL;

        -- Agora que todos os registros têm um criador, tornar a coluna NOT NULL
        ALTER TABLE bandas ALTER COLUMN criador_id SET NOT NULL;
    END IF;

    -- Adicionar coluna papel se não existir na tabela membros_banda
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membros_banda' AND column_name = 'papel') THEN
        ALTER TABLE membros_banda ADD COLUMN papel TEXT NOT NULL DEFAULT 'membro' CHECK (papel IN ('admin', 'membro'));
    END IF;
END $$;

-- Remover os valores default temporários
ALTER TABLE bandas ALTER COLUMN cidade DROP DEFAULT;
ALTER TABLE bandas ALTER COLUMN estado DROP DEFAULT;
ALTER TABLE bandas ALTER COLUMN genero DROP DEFAULT;

-- Atualizar os registros existentes com valores de exemplo
UPDATE bandas 
SET cidade = 'São Paulo', 
    estado = 'SP', 
    genero = 'Rock' 
WHERE nome = 'Os Rockeiros';

UPDATE bandas 
SET cidade = 'Rio de Janeiro', 
    estado = 'RJ', 
    genero = 'Jazz' 
WHERE nome = 'Jazz Masters';

UPDATE bandas 
SET cidade = 'São Paulo', 
    estado = 'SP', 
    genero = 'Samba' 
WHERE nome = 'Samba Roots';

-- Criar tabela de membros de banda (relação muitos-para-muitos entre musicos e bandas)
CREATE TABLE IF NOT EXISTS membros_banda (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  musico_id UUID NOT NULL REFERENCES musicos(id) ON DELETE CASCADE,
  banda_id UUID NOT NULL REFERENCES bandas(id) ON DELETE CASCADE,
  instrumento TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(musico_id, banda_id)
);

-- Criar tabela de compromissos da banda
CREATE TABLE IF NOT EXISTS compromissos_banda (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  banda_id UUID NOT NULL REFERENCES bandas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  local TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'cancelado', 'concluido')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Criar índices para melhorar performance (apenas se não existirem)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bandas_id') THEN
        CREATE INDEX idx_bandas_id ON bandas(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_membros_banda_musico_id') THEN
        CREATE INDEX idx_membros_banda_musico_id ON membros_banda(musico_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_membros_banda_banda_id') THEN
        CREATE INDEX idx_membros_banda_banda_id ON membros_banda(banda_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_compromissos_banda_id') THEN
        CREATE INDEX idx_compromissos_banda_id ON compromissos_banda(banda_id);
    END IF;
END $$;

-- Habilitar RLS para as novas tabelas (se ainda não estiver habilitado)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'bandas' AND rowsecurity = true) THEN
        ALTER TABLE bandas ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'membros_banda' AND rowsecurity = true) THEN
        ALTER TABLE membros_banda ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'compromissos_banda' AND rowsecurity = true) THEN
        ALTER TABLE compromissos_banda ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Criar políticas de segurança (apenas se não existirem)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bandas' AND policyname = 'Acesso público a bandas') THEN
        CREATE POLICY "Acesso público a bandas" ON bandas FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'membros_banda' AND policyname = 'Acesso público a membros de banda') THEN
        CREATE POLICY "Acesso público a membros de banda" ON membros_banda FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'compromissos_banda' AND policyname = 'Acesso público a compromissos') THEN
        CREATE POLICY "Acesso público a compromissos" ON compromissos_banda FOR SELECT USING (true);
    END IF;
END $$;

-- Função para verificar se uma banda tem compromissos futuros (substituir se já existir)
CREATE OR REPLACE FUNCTION banda_tem_compromissos_futuros(banda_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM compromissos_banda 
    WHERE banda_id = $1 
    AND status = 'agendado'
    AND (data > CURRENT_DATE OR (data = CURRENT_DATE AND hora > CURRENT_TIME))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Inserir dados de exemplo apenas se não existirem
DO $$ 
DECLARE
    rockeiros_id UUID;
    jazz_masters_id UUID;
    samba_roots_id UUID;
    joao_id UUID;
    maria_id UUID;
    carlos_id UUID;
    ana_id UUID;
BEGIN
    -- Obter IDs das bandas
    SELECT id INTO rockeiros_id FROM bandas WHERE nome = 'Os Rockeiros';
    SELECT id INTO jazz_masters_id FROM bandas WHERE nome = 'Jazz Masters';
    SELECT id INTO samba_roots_id FROM bandas WHERE nome = 'Samba Roots';

    -- Obter IDs dos músicos
    SELECT id INTO joao_id FROM musicos WHERE email = 'joao@exemplo.com';
    SELECT id INTO maria_id FROM musicos WHERE email = 'maria@exemplo.com';
    SELECT id INTO carlos_id FROM musicos WHERE email = 'carlos@exemplo.com';
    SELECT id INTO ana_id FROM musicos WHERE email = 'ana@exemplo.com';

    -- Inserir bandas apenas se não existirem
    IF NOT EXISTS (SELECT 1 FROM bandas WHERE nome = 'Os Rockeiros') THEN
        INSERT INTO bandas (nome, descricao, cidade, estado, genero) 
        VALUES ('Os Rockeiros', 'Banda de rock clássico', 'São Paulo', 'SP', 'Rock')
        RETURNING id INTO rockeiros_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM bandas WHERE nome = 'Jazz Masters') THEN
        INSERT INTO bandas (nome, descricao, cidade, estado, genero) 
        VALUES ('Jazz Masters', 'Grupo de jazz contemporâneo', 'Rio de Janeiro', 'RJ', 'Jazz')
        RETURNING id INTO jazz_masters_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM bandas WHERE nome = 'Samba Roots') THEN
        INSERT INTO bandas (nome, descricao, cidade, estado, genero) 
        VALUES ('Samba Roots', 'Tradição do samba brasileiro', 'São Paulo', 'SP', 'Samba')
        RETURNING id INTO samba_roots_id;
    END IF;

    -- Inserir membros apenas se não existirem
    IF joao_id IS NOT NULL AND rockeiros_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM membros_banda WHERE musico_id = joao_id AND banda_id = rockeiros_id) THEN
            INSERT INTO membros_banda (musico_id, banda_id, instrumento) 
            VALUES (joao_id, rockeiros_id, 'Guitarra');
        END IF;
    END IF;

    IF maria_id IS NOT NULL AND rockeiros_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM membros_banda WHERE musico_id = maria_id AND banda_id = rockeiros_id) THEN
            INSERT INTO membros_banda (musico_id, banda_id, instrumento) 
            VALUES (maria_id, rockeiros_id, 'Baixo');
        END IF;
    END IF;

    IF carlos_id IS NOT NULL AND jazz_masters_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM membros_banda WHERE musico_id = carlos_id AND banda_id = jazz_masters_id) THEN
            INSERT INTO membros_banda (musico_id, banda_id, instrumento) 
            VALUES (carlos_id, jazz_masters_id, 'Bateria');
        END IF;
    END IF;

    IF ana_id IS NOT NULL AND samba_roots_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM membros_banda WHERE musico_id = ana_id AND banda_id = samba_roots_id) THEN
            INSERT INTO membros_banda (musico_id, banda_id, instrumento) 
            VALUES (ana_id, samba_roots_id, 'Vocal');
        END IF;
    END IF;

    -- Inserir compromissos apenas se não existirem
    IF rockeiros_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM compromissos_banda 
            WHERE banda_id = rockeiros_id 
            AND titulo = 'Show no Bar do Rock'
            AND data = '2023-12-25'::DATE
        ) THEN
            INSERT INTO compromissos_banda (banda_id, titulo, descricao, data, hora, local) 
            VALUES (rockeiros_id, 'Show no Bar do Rock', 'Show de rock clássico', '2023-12-25', '22:00', 'Bar do Rock - SP');
        END IF;
    END IF;

    IF jazz_masters_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM compromissos_banda 
            WHERE banda_id = jazz_masters_id 
            AND titulo = 'Festival de Jazz'
            AND data = '2023-12-30'::DATE
        ) THEN
            INSERT INTO compromissos_banda (banda_id, titulo, descricao, data, hora, local) 
            VALUES (jazz_masters_id, 'Festival de Jazz', 'Participação no festival anual', '2023-12-30', '20:00', 'Teatro Municipal - RJ');
        END IF;
    END IF;

    IF samba_roots_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM compromissos_banda 
            WHERE banda_id = samba_roots_id 
            AND titulo = 'Carnaval'
            AND data = '2024-02-10'::DATE
        ) THEN
            INSERT INTO compromissos_banda (banda_id, titulo, descricao, data, hora, local) 
            VALUES (samba_roots_id, 'Carnaval', 'Apresentação no bloco', '2024-02-10', '15:00', 'Avenida Paulista - SP');
        END IF;
    END IF;
END $$; 