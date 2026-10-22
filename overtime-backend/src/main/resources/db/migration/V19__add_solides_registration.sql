-- ============================================================
-- OvertimeOS — Adiciona campo solides_registration em employees
--
-- Motivo: o campo "registration" é uma matrícula sequencial gerada
-- internamente pelo sistema (generateNextRegistration), sem relação
-- com a matrícula real do colaborador no Solides. O webhook de edição
-- comparava a "matricula" recebida do Solides contra esse campo interno,
-- causando falsos positivos quando os números coincidiam por acaso
-- (ex.: colaborador X do Solides com matrícula igual ao registration
-- sequencial de um colaborador Y completamente diferente no sistema).
--
-- Este campo passa a guardar a matrícula real do Solides, usada
-- exclusivamente para o matching do webhook.
-- ============================================================

ALTER TABLE employees ADD COLUMN IF NOT EXISTS solides_registration VARCHAR(20);
