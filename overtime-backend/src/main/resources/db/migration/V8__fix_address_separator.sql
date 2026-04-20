-- Substitui o separador ' — ' por ', ' em todos os endereços
UPDATE employees SET address = REPLACE(address, ' — ', ', ') WHERE address IS NOT NULL;
