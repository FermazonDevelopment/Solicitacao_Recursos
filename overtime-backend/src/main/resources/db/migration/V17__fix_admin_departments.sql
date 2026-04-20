UPDATE departments SET is_admin = FALSE WHERE UPPER(TRIM(name)) = 'ADMINISTRATIVO';
UPDATE departments SET is_admin = TRUE  WHERE UPPER(TRIM(name)) = 'SERVIÇOS GERAIS';
