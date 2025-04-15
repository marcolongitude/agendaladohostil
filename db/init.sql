-- Criar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Extensão pgcrypto para criptografia de senhas
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar tabela de músicos com tipo de usuário e senha
CREATE TABLE musicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT NOT NULL,
  instrumento TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('musico', 'manager')),
  senha TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Criar tabela de shows
CREATE TABLE shows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_evento TEXT NOT NULL,
  cidade TEXT NOT NULL,
  casa_de_show TEXT NOT NULL,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Criar tabela de aceites de show
CREATE TABLE aceites_show (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  musico_id UUID NOT NULL REFERENCES musicos(id) ON DELETE CASCADE,
  show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceito', 'recusado')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Criar índices para melhorar performance de consultas
CREATE INDEX idx_musicos_id ON musicos(id);
CREATE INDEX idx_musicos_email ON musicos(email);
CREATE INDEX idx_shows_id ON shows(id);
CREATE INDEX idx_aceites_show_musico_id ON aceites_show(musico_id);
CREATE INDEX idx_aceites_show_show_id ON aceites_show(show_id);

-- Adicionar políticas de segurança RLS (Row Level Security)
ALTER TABLE musicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE aceites_show ENABLE ROW LEVEL SECURITY;

-- Criar políticas para acesso público (você pode ajustar conforme necessário)
CREATE POLICY "Acesso público a músicos" ON musicos FOR SELECT USING (true);
CREATE POLICY "Acesso público a shows" ON shows FOR SELECT USING (true);
CREATE POLICY "Acesso público a aceites" ON aceites_show FOR SELECT USING (true);

-- Função para criar um novo usuário com senha criptografada
CREATE OR REPLACE FUNCTION criar_usuario(
  nome TEXT,
  email TEXT,
  telefone TEXT,
  instrumento TEXT,
  tipo TEXT,
  senha_texto TEXT
) RETURNS UUID AS $$
DECLARE
  novo_id UUID;
BEGIN
  INSERT INTO musicos (nome, email, telefone, instrumento, tipo, senha)
  VALUES (nome, email, telefone, instrumento, tipo, crypt(senha_texto, gen_salt('bf')))
  RETURNING id INTO novo_id;
  
  RETURN novo_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar senha
CREATE OR REPLACE FUNCTION verificar_senha(
  email_usuario TEXT,
  senha_texto TEXT
) RETURNS TABLE (
  id UUID,
  nome TEXT,
  tipo TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT m.id, m.nome, m.tipo
  FROM musicos m
  WHERE m.email = email_usuario
  AND m.senha = crypt(senha_texto, m.senha);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Inserir alguns dados de exemplo usando a função de criação de usuário
SELECT criar_usuario(
  'João Silva', 
  'joao@exemplo.com', 
  '(11) 98765-4321', 
  'Guitarra', 
  'musico', 
  'senha123'
);

SELECT criar_usuario(
  'Maria Oliveira', 
  'maria@exemplo.com', 
  '(11) 91234-5678', 
  'Baixo', 
  'musico', 
  'senha123'
);

SELECT criar_usuario(
  'Carlos Santos', 
  'carlos@exemplo.com', 
  '(11) 92345-6789', 
  'Bateria', 
  'musico', 
  'senha123'
);

SELECT criar_usuario(
  'Ana Pereira', 
  'ana@exemplo.com', 
  '(11) 93456-7890', 
  'Vocal', 
  'manager', 
  'senha123'
);

INSERT INTO shows (nome_evento, cidade, casa_de_show, data, hora) 
VALUES 
  ('Festival Rock', 'São Paulo', 'Arena SP', '2023-12-15', '20:00'),
  ('Noite Jazz', 'Rio de Janeiro', 'Blue Note', '2023-12-20', '21:30'); 