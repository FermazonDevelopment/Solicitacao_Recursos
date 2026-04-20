UPDATE departments SET is_admin = TRUE WHERE UPPER(TRIM(name)) = 'ADMINISTRATIVO';
