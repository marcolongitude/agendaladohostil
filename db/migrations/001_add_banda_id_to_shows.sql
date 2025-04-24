-- Adicionar coluna banda_id à tabela shows
ALTER TABLE shows ADD COLUMN banda_id UUID REFERENCES bandas(id) ON DELETE CASCADE;

-- Criar índice para melhorar performance de consultas
CREATE INDEX idx_shows_banda_id ON shows(banda_id);

-- Adicionar política de segurança RLS
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;

-- Criar política para acesso baseado na banda
CREATE POLICY "Acesso a shows por banda" ON shows
  FOR ALL
  USING (
    banda_id IN (
      SELECT banda_id
      FROM membros_banda
      WHERE musico_id = auth.uid()
    )
  ); 