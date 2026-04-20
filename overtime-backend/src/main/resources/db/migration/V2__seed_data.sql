-- ============================================================
-- OvertimeOS — Dados iniciais
-- Senhas: departamentos = '1234', Administrativo = 'admin@2025'
-- (armazenadas em BCrypt — geradas com strength 10)
-- ============================================================

-- Hashes gerados com BCryptPasswordEncoder (strength 10) e verificados
-- '1234'       => $2a$10$.LVaxe5Mk6DUyreb5s9Eu.9uNNRgewR5.7g8VUXZT7w/MG7m7p76e
-- 'admin@2025' => $2a$10$1EFpY5c/8aiLtuFk4B8nFOAkdImekcWLHu/5wl3pAT304h/sWtQq2
INSERT INTO departments (name, password, is_admin) VALUES
    ('TI',             '$2a$10$.LVaxe5Mk6DUyreb5s9Eu.9uNNRgewR5.7g8VUXZT7w/MG7m7p76e', FALSE),
    ('Financeiro',     '$2a$10$.LVaxe5Mk6DUyreb5s9Eu.9uNNRgewR5.7g8VUXZT7w/MG7m7p76e', FALSE),
    ('RH',             '$2a$10$.LVaxe5Mk6DUyreb5s9Eu.9uNNRgewR5.7g8VUXZT7w/MG7m7p76e', FALSE),
    ('Comercial',      '$2a$10$.LVaxe5Mk6DUyreb5s9Eu.9uNNRgewR5.7g8VUXZT7w/MG7m7p76e', FALSE),
    ('PCP',            '$2a$10$.LVaxe5Mk6DUyreb5s9Eu.9uNNRgewR5.7g8VUXZT7w/MG7m7p76e', FALSE),
    ('Administrativo', '$2a$10$1EFpY5c/8aiLtuFk4B8nFOAkdImekcWLHu/5wl3pAT304h/sWtQq2', TRUE)
ON CONFLICT (name) DO NOTHING;

-- TI
INSERT INTO employees (name, department_id, address, registration) VALUES
    ('Carlos Mendes',     (SELECT id FROM departments WHERE name='TI'), 'Rua das Acácias, 142 — Vila Madalena, SP',        '001'),
    ('Ana Paula Sousa',   (SELECT id FROM departments WHERE name='TI'), 'Av. Brigadeiro Faria Lima, 890 — Pinheiros, SP',  '002'),
    ('Ricardo Ferreira',  (SELECT id FROM departments WHERE name='TI'), 'Rua Consolação, 2344 — Consolação, SP',           '003'),
    ('Juliana Costa',     (SELECT id FROM departments WHERE name='TI'), 'Al. Santos, 1500 — Jardins, SP',                  '004'),
    ('Thiago Almeida',    (SELECT id FROM departments WHERE name='TI'), 'Rua Augusta, 755 — Centro, SP',                   '005')
ON CONFLICT (registration) DO NOTHING;

-- Financeiro
INSERT INTO employees (name, department_id, address, registration) VALUES
    ('Mariana Lima',      (SELECT id FROM departments WHERE name='Financeiro'), 'Rua do Hipódromo, 320 — Mooca, SP',           '006'),
    ('Fernando Oliveira', (SELECT id FROM departments WHERE name='Financeiro'), 'Av. Celso Garcia, 1100 — Brás, SP',           '007'),
    ('Camila Rodrigues',  (SELECT id FROM departments WHERE name='Financeiro'), 'Rua Dr. Zuquim, 567 — Santana, SP',           '008'),
    ('Luiz Henrique',     (SELECT id FROM departments WHERE name='Financeiro'), 'Av. Pompeia, 450 — Pompeia, SP',              '009')
ON CONFLICT (registration) DO NOTHING;

-- RH
INSERT INTO employees (name, department_id, address, registration) VALUES
    ('Patricia Nunes',    (SELECT id FROM departments WHERE name='RH'), 'Rua Catão, 88 — Lapa, SP',                        '010'),
    ('Gabriel Santos',    (SELECT id FROM departments WHERE name='RH'), 'Rua Tuiuti, 210 — Tatuapé, SP',                   '011'),
    ('Renata Machado',    (SELECT id FROM departments WHERE name='RH'), 'Rua Vergueiro, 3400 — Vila Mariana, SP',          '012'),
    ('Diego Pereira',     (SELECT id FROM departments WHERE name='RH'), 'Rua Domingos de Morais, 1250 — Vila Mariana, SP', '013')
ON CONFLICT (registration) DO NOTHING;

-- Comercial
INSERT INTO employees (name, department_id, address, registration) VALUES
    ('Bruna Carvalho',    (SELECT id FROM departments WHERE name='Comercial'), 'Av. Jabaquara, 2200 — Mirandópolis, SP',  '014'),
    ('Marcelo Vieira',    (SELECT id FROM departments WHERE name='Comercial'), 'Rua dos Três Irmãos, 350 — Ipiranga, SP', '015'),
    ('Amanda Nascimento', (SELECT id FROM departments WHERE name='Comercial'), 'Av. do Cursino, 780 — Cursino, SP',       '016'),
    ('Roberto Pinto',     (SELECT id FROM departments WHERE name='Comercial'), 'Rua Verônica, 120 — Saúde, SP',           '017'),
    ('Vanessa Moura',     (SELECT id FROM departments WHERE name='Comercial'), 'Al. dos Maracatins, 560 — Moema, SP',     '018')
ON CONFLICT (registration) DO NOTHING;

-- PCP
INSERT INTO employees (name, department_id, address, registration) VALUES
    ('Alexandre Cruz',    (SELECT id FROM departments WHERE name='PCP'), 'Rua Silveira Martins, 445 — Belém, SP',       '019'),
    ('Tatiana Gomes',     (SELECT id FROM departments WHERE name='PCP'), 'Rua Bresser, 1120 — Mooca, SP',               '020'),
    ('Paulo Rocha',       (SELECT id FROM departments WHERE name='PCP'), 'Av. Alcântara Machado, 890 — Mooca, SP',      '021'),
    ('Fernanda Araújo',   (SELECT id FROM departments WHERE name='PCP'), 'Rua Javari, 230 — Mooca, SP',                 '022')
ON CONFLICT (registration) DO NOTHING;

-- Administrativo
INSERT INTO employees (name, department_id, address, registration) VALUES
    ('Sônia Batista',     (SELECT id FROM departments WHERE name='Administrativo'), 'Rua da Consolação, 400 — Centro, SP',  '023'),
    ('Eduardo Lopes',     (SELECT id FROM departments WHERE name='Administrativo'), 'Rua Líbero Badaró, 590 — Centro, SP',  '024'),
    ('Cristiane Fonseca', (SELECT id FROM departments WHERE name='Administrativo'), 'Rua XV de Novembro, 200 — Centro, SP', '025')
ON CONFLICT (registration) DO NOTHING;
