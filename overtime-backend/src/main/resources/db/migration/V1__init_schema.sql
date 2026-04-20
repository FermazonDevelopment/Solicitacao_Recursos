-- ============================================================
-- OvertimeOS — Schema inicial
-- ============================================================

CREATE TABLE IF NOT EXISTS departments (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS employees (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    department_id   INTEGER NOT NULL REFERENCES departments(id),
    address         TEXT,
    registration    VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS overtime_requests (
    id              VARCHAR(50) PRIMARY KEY,
    employee_id     INTEGER NOT NULL REFERENCES employees(id),
    date            DATE NOT NULL,
    day_type        VARCHAR(20) NOT NULL CHECK (day_type IN ('weekday','weekend')),
    permanencia     VARCHAR(20) NOT NULL CHECK (permanencia IN ('19:30','21:00','until12','after12')),
    veiculo_proprio BOOLEAN NOT NULL DEFAULT FALSE,
    motivo          TEXT NOT NULL,
    registered_by   VARCHAR(50) NOT NULL,
    registered_at   TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (employee_id, date)
);

CREATE TABLE IF NOT EXISTS overtime_request_resources (
    request_id  VARCHAR(50) NOT NULL REFERENCES overtime_requests(id) ON DELETE CASCADE,
    resource    VARCHAR(20) NOT NULL CHECK (resource IN ('lanche','janta','rota','uber','cafe','almoco')),
    PRIMARY KEY (request_id, resource)
);

CREATE INDEX idx_requests_date         ON overtime_requests(date);
CREATE INDEX idx_requests_employee     ON overtime_requests(employee_id);
CREATE INDEX idx_requests_registered   ON overtime_requests(registered_at DESC);
