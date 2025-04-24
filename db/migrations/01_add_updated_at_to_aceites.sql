-- Adicionar coluna updated_at
ALTER TABLE aceites_show
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- Atualizar registros existentes
UPDATE aceites_show
SET updated_at = created_at
WHERE updated_at IS NULL; 