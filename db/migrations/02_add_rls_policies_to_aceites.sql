-- Adicionar política para permitir UPDATE em aceites pendentes
CREATE POLICY "Permitir atualização de aceites pendentes" ON aceites_show
FOR UPDATE USING (
    status = 'pendente'
) WITH CHECK (
    status IN ('aceito', 'recusado')
);

-- Adicionar política para permitir INSERT (caso necessário no futuro)
CREATE POLICY "Permitir inserção de aceites" ON aceites_show
FOR INSERT WITH CHECK (true);

-- Atualizar a política de SELECT existente para ser mais específica
DROP POLICY IF EXISTS "Acesso público a aceites" ON aceites_show;
CREATE POLICY "Permitir visualização de aceites" ON aceites_show
FOR SELECT USING (true); 