-- Adicionar política para permitir UPDATE em aceites pendentes
CREATE POLICY "Permitir atualização de aceites pendentes" ON aceites_show
FOR UPDATE USING (
    status = 'pendente'
) WITH CHECK (
    status IN ('aceito', 'recusado')
); 