-- Remove solicitações dos funcionários dos departamentos legados
DELETE FROM overtime_request_resources
WHERE request_id IN (
    SELECT r.id FROM overtime_requests r
    JOIN employees e ON e.id = r.employee_id
    JOIN departments d ON d.id = e.department_id
    WHERE d.name IN ('Administrativo', 'Comercial', 'PCP', 'RH')
);

DELETE FROM overtime_requests
WHERE employee_id IN (
    SELECT e.id FROM employees e
    JOIN departments d ON d.id = e.department_id
    WHERE d.name IN ('Administrativo', 'Comercial', 'PCP', 'RH')
);

-- Remove funcionários dos departamentos legados
DELETE FROM employees
WHERE department_id IN (
    SELECT id FROM departments
    WHERE name IN ('Administrativo', 'Comercial', 'PCP', 'RH')
);

-- Remove os departamentos legados
DELETE FROM departments
WHERE name IN ('Administrativo', 'Comercial', 'PCP', 'RH');
