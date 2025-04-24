-- Habilitar RLS na tabela aceites_show
ALTER TABLE aceites_show ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir inserção de aceites
CREATE POLICY "Permitir inserção de aceites" ON aceites_show
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shows s
      JOIN membros_banda mb ON mb.banda_id = s.banda_id
      WHERE s.id = show_id
      AND mb.musico_id = auth.uid()
    )
  );

-- Criar política para permitir leitura de aceites
CREATE POLICY "Permitir leitura de aceites" ON aceites_show
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM shows s
      JOIN membros_banda mb ON mb.banda_id = s.banda_id
      WHERE s.id = show_id
      AND mb.musico_id = auth.uid()
    )
  ); 