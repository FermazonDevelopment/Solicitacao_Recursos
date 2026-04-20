-- ============================================================
-- OvertimeOS — Inserção de colaboradores por departamento
-- Ignora colaboradores já cadastrados (verificação por UPPER(TRIM(name)))
-- Matrícula gerada automaticamente a partir do maior valor numérico atual
-- ============================================================

DO $$
DECLARE
  v_reg  INT;
  v_dept INT;
BEGIN

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'BEATRIZ DOS REIS COSTA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'COMERCIAL';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('BEATRIZ DOS REIS COSTA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'PAULINHO ROMAINA CARVALHO') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('PAULINHO ROMAINA CARVALHO', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'ANDRE CUNHA CAMARÃO') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'TRANSPORTES';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('ANDRE CUNHA CAMARÃO', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'EDJARA BARRETO MACIEL') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('EDJARA BARRETO MACIEL', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'LILIAN GOMES DE MEDEIROS') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'VENDAS';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('LILIAN GOMES DE MEDEIROS', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'EDMUNDO DUTRA BACURY') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'SERVIÇOS GERAIS OPE';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('EDMUNDO DUTRA BACURY', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'SEBASTIÃO HELDEM OLIVEIRA MACIEL') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'TRANSPORTES';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('SEBASTIÃO HELDEM OLIVEIRA MACIEL', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'CELSO DOS SANTOS SILVA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'LOGISTICA INTERNA';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('CELSO DOS SANTOS SILVA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'PAULO HENRIQUE DOS SANTOS COSTA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('PAULO HENRIQUE DOS SANTOS COSTA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'RENATO ARAUJO CORREA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCL';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('RENATO ARAUJO CORREA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'FRANCISCO DE ALBUQUERQUE MACHADO') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCL';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('FRANCISCO DE ALBUQUERQUE MACHADO', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'JAQUELINE PEREIRA FERREIRA BRANDAO DE SA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'CONFORMIDADE';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('JAQUELINE PEREIRA FERREIRA BRANDAO DE SA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'ELISON ANDRADE DA SILVA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'LOGISTICA INTERNA DBA';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('ELISON ANDRADE DA SILVA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'CARLOS CESAR SIMAS DE NAZARE') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('CARLOS CESAR SIMAS DE NAZARE', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'TASSIA HERMIDO DA SILVA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'VENDAS';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('TASSIA HERMIDO DA SILVA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'JEOVA SANTANA DA SILVA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'TRANSPORTES';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('JEOVA SANTANA DA SILVA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'AILSON NERES NUNES') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'COMERCIAL';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('AILSON NERES NUNES', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'JOSE DE NAZARE AUGUSTO DE MOURA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCL';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('JOSE DE NAZARE AUGUSTO DE MOURA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'RELNRY SOUSA DE ANDRADE') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'GERENCIA INDUSTRIAL-CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('RELNRY SOUSA DE ANDRADE', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'HANZLEY GRIMM SOARES') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'MANUTENÇÃO';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('HANZLEY GRIMM SOARES', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'MONICA CARVALHO DA SILVA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'VENDAS';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('MONICA CARVALHO DA SILVA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'BRUNO FIGUEIRA DOS SANTOS') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('BRUNO FIGUEIRA DOS SANTOS', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'WELLINGTON BENEDITO PEREIRA SENA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('WELLINGTON BENEDITO PEREIRA SENA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'LEIDIANE PEREIRA DE OLIVEIRA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PROCESSOS E PROJETOS';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('LEIDIANE PEREIRA DE OLIVEIRA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'RAUL JOSE MAGALHAES ALVES') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'DIRETORIA';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('RAUL JOSE MAGALHAES ALVES', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'VINICIUS VAZ QUEIROZ') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'GERENCIA ADMINISTRATIVA';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('VINICIUS VAZ QUEIROZ', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'MARIA TEUNICE RABELO DA SILVA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'FISCAL';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('MARIA TEUNICE RABELO DA SILVA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'FERNANDA COSTA DE SOUZA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PROCESSOS E PROJETOS';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('FERNANDA COSTA DE SOUZA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'ARY FERMIN NETO') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('ARY FERMIN NETO', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'MAYKEL FREITAS MOURA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('MAYKEL FREITAS MOURA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'DIEGO CASTRO DA SILVA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('DIEGO CASTRO DA SILVA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'MARCOS VINICIUS FACCHIN DIEHL') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'GERENCIA INDUSTRIAL-CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('MARCOS VINICIUS FACCHIN DIEHL', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'RAYANNE OLIVEIRA DA SILVA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'VENDAS';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('RAYANNE OLIVEIRA DA SILVA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'LUCAS VASCONCELOS LEMOS') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'MANUTENÇÃO';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('LUCAS VASCONCELOS LEMOS', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'LUDMILLA MACHADO CERQUEIRA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'TRANSPORTE';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('LUDMILLA MACHADO CERQUEIRA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'IZAIAS FERREIRA LIMA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'TRANSPORTE';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('IZAIAS FERREIRA LIMA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'EDUARDO FELIPE DA SILVA EVARISTO') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'ADMINISTRATIVO';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('EDUARDO FELIPE DA SILVA EVARISTO', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'CARLOS AUGUSTO DA SILVA QUARESMA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'TRANSPORTES';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('CARLOS AUGUSTO DA SILVA QUARESMA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'GABRIEL DE OLIVEIRA SILVA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'TI';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('GABRIEL DE OLIVEIRA SILVA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'JOÃO MARCOS ANDRADE MOREIRA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'VENDAS';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('JOÃO MARCOS ANDRADE MOREIRA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'HELENA DE SOUSA ALVES') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'ADMINISTRATIVO';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('HELENA DE SOUSA ALVES', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'ANDERSON DE MORAES PINHEIRO') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'CONFORMIDADE';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('ANDERSON DE MORAES PINHEIRO', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'RENATO INACIO DA SILVA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'MANUTENÇÃO';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('RENATO INACIO DA SILVA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'JOSE CAIQUE FRANÇA DE OLIVEIRA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('JOSE CAIQUE FRANÇA DE OLIVEIRA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'DIEGO SERRÃO DA SILVA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'TRANSPORTES';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('DIEGO SERRÃO DA SILVA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'ANA VITÓRIA SILVA SANTOS') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'RECURSOS HUMANOS RH';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('ANA VITÓRIA SILVA SANTOS', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'WILLIAN BENTES ELEUTERIO') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('WILLIAN BENTES ELEUTERIO', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'MACIEL TEIXEIRA DE OLIVEIRA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'TRANSPORTES';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('MACIEL TEIXEIRA DE OLIVEIRA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'NILTON CHAVES BATISTA FILHO') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'APERAM - VENDAS';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('NILTON CHAVES BATISTA FILHO', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'GABRIEL MARTINS BATISTA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'VENDAS';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('GABRIEL MARTINS BATISTA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'RONILCE GALE') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'ADMINISTRATIVO';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('RONILCE GALE', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'DANIEL MARCOS DOS ANJOS LUCAS') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'LOGISTICA INTERNA DBA';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('DANIEL MARCOS DOS ANJOS LUCAS', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'CRISTIANO RIBEIRO DOS SANTOS') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'TRANSPORTES';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('CRISTIANO RIBEIRO DOS SANTOS', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'RAILTON CARDOSO DE SOUZA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('RAILTON CARDOSO DE SOUZA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'MILTON MARABA MESQUITA DA SILVA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'LOGISTICA';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('MILTON MARABA MESQUITA DA SILVA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'JOAO VITOR DE CASTRO LEMOS') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('JOAO VITOR DE CASTRO LEMOS', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'ANA CELIA AMORIM SOUZA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'ADMINISTRATIVO';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('ANA CELIA AMORIM SOUZA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'CAMILA ALVES DE SOUZA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'VENDAS';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('CAMILA ALVES DE SOUZA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'ALAILSON MENDONÇA TEIXEIRA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('ALAILSON MENDONÇA TEIXEIRA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'ARIEDSON BATISTA DA SILVA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('ARIEDSON BATISTA DA SILVA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'JONATAS VARGAS DE SOUZA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PLANEJ. CONTROL. PROD. - PCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('JONATAS VARGAS DE SOUZA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'ADRIELY DA SILVA BINDA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('ADRIELY DA SILVA BINDA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'EMANUEL RAMYRES CORREA DE ALMEIDA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'OPERAÇÃO METÁLICOS';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('EMANUEL RAMYRES CORREA DE ALMEIDA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'EDGAR CORREA DOS SANTOS') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'SERVIÇOS GERAIS';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('EDGAR CORREA DOS SANTOS', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'CARLOS HENRIQUE DA SILVA GODINHO') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'LOGISTICA INTERNA';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('CARLOS HENRIQUE DA SILVA GODINHO', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'DAVI DOS SANTOS') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'TRANSPORTES';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('DAVI DOS SANTOS', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'PAULO CEZAR HOLANDA DA SILVA JUNIOR') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'TI';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('PAULO CEZAR HOLANDA DA SILVA JUNIOR', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'MATEUS AZEVEDO NERY') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('MATEUS AZEVEDO NERY', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'SAMUEL RODRIGUES MORENO') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'MANUTENÇÃO';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('SAMUEL RODRIGUES MORENO', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'ROGERIO PEREIRA VIEIRA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'LOGISTICA INTERNA';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('ROGERIO PEREIRA VIEIRA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'ELANNA RODRIGUES DE SOUSA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'CONFORMIDADE';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('ELANNA RODRIGUES DE SOUSA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'ADRIANA GEORGEA DA SILVA GABRIEL') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'FINANÇAS';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('ADRIANA GEORGEA DA SILVA GABRIEL', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'JOSE FERNANDO SANTA RITA DE OLIVEIRA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'LOGISTICA INTERNA';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('JOSE FERNANDO SANTA RITA DE OLIVEIRA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'MIGUEL ANGEL CASOLA ARREAZA') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'LOGISTICA';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('MIGUEL ANGEL CASOLA ARREAZA', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'CARLOS ALFREDO SALAZAR PEREZ') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'LOGISTICA';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('CARLOS ALFREDO SALAZAR PEREZ', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'EMILSON SILVA DOS SANTOS') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'LOGISTICA INTERNA DBA';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('EMILSON SILVA DOS SANTOS', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM employees WHERE UPPER(TRIM(name)) = 'SEBASTIAO RODRIGUES GOMES') THEN
    SELECT id INTO v_dept FROM departments WHERE UPPER(TRIM(name)) = 'PRODUÇÃO CCP';
    SELECT COALESCE(MAX(CAST(registration AS INT)), 0) + 1 INTO v_reg FROM employees WHERE registration ~ '^\d+$';
    INSERT INTO employees (name, department_id, address, registration) VALUES ('SEBASTIAO RODRIGUES GOMES', v_dept, NULL, LPAD(v_reg::TEXT, 3, '0'));
  END IF;

END $$;
